// account.service.spec.js
import { strict as assert } from "node:assert";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createAccountInRepository,
  deleteAccountByIdForUserInRepository,
  getAccountsByUserIdFromRepository,
} from "./account.repository.js";
import {
  createAccount,
  deleteAccount,
  getAccounts,
} from "./account.service.js";

vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn(),
  getAccountsByUserIdFromRepository: vi.fn(),
  deleteAccountByIdForUserInRepository: vi.fn(),
}));

describe("Account Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("createAccount réussi", async () => {
    createAccountInRepository.mockResolvedValueOnce({
      id: 12,
      userId: 2,
      amount: 150.5,
    });

    const payload = { userId: 2, amount: 150.5 };
    const account = await createAccount(payload);

    expect(account).toBeDefined();
    expect(account.id).toBeTypeOf("number");
    expect(account).toHaveProperty("userId", 2);
    expect(account).toHaveProperty("amount", 150.5);

    expect(createAccountInRepository).toBeCalledTimes(1);
    expect(createAccountInRepository).toBeCalledWith(payload);
  });

  it("createAccount échoue avec de mauvais paramètres", async () => {
    try {
      // userId manquant -> schéma invalide
      await createAccount({ amount: 50 });
      assert.fail("createAccount devrait lever une erreur de validation.");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
      expect(createAccountInRepository).not.toHaveBeenCalled();
    }
  });

  it("getAccounts réussi en vérifiant chaque élément de la liste", async () => {
    const userId = 3;
    const rows = [
      { id: 1, userId, amount: 0 },
      { id: 2, userId, amount: 200.75 },
      { id: 3, userId, amount: 50 },
    ];
    getAccountsByUserIdFromRepository.mockResolvedValueOnce(rows);

    const accounts = await getAccounts({ userId });

    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts).toHaveLength(3);

    accounts.forEach((acc, idx) => {
      expect(acc).toHaveProperty("id", rows[idx].id);
      expect(acc).toHaveProperty("userId", userId);
      expect(acc.amount).toBeTypeOf("number");
      expect(acc.amount).toBe(rows[idx].amount);
    });

    expect(getAccountsByUserIdFromRepository).toBeCalledTimes(1);
    expect(getAccountsByUserIdFromRepository).toBeCalledWith(userId);
  });

  it("deleteAccount réussi", async () => {
    const data = { userId: 4, accountId: 10 };
    const deleted = { id: 10, userId: 4, amount: 0 };

    deleteAccountByIdForUserInRepository.mockResolvedValueOnce(deleted);

    const res = await deleteAccount(data);

    expect(res).toEqual(deleted);
    expect(deleteAccountByIdForUserInRepository).toBeCalledTimes(1);
    expect(deleteAccountByIdForUserInRepository).toBeCalledWith(data);
  });

  it("deleteAccount échoue avec un mauvais id d'Account", async () => {
    const data = { userId: 4, accountId: 999 }; // inexistant
    // Le service considère "0", "null" ou "undefined" comme non trouvé
    deleteAccountByIdForUserInRepository.mockResolvedValueOnce(0);

    try {
      await deleteAccount(data);
      assert.fail(
        "deleteAccount devrait lever HttpNotFound pour un mauvais id."
      );
    } catch (e) {
      expect(e.name).toBe("HttpNotFound");
      expect(e.statusCode).toBe(404);
      expect(deleteAccountByIdForUserInRepository).toBeCalledTimes(1);
      expect(deleteAccountByIdForUserInRepository).toBeCalledWith(data);
    }
  });
});
