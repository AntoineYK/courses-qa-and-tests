// account.service.js
import { HttpBadRequest, HttpNotFound } from "@httpx/exception";
import { z } from "zod";
import {
  createAccountInRepository,
  deleteAccountByIdForUserInRepository,
  getAccountsByUserIdFromRepository,
} from "./account.repository";

// Schéma aligné sur sql/init.sql:
// accounts(id SERIAL, userId INT, amount FLOAT)
const CreateAccountSchema = z.object({
  userId: z.number().int().positive(),
  amount: z.number().finite().default(0),
});

const GetAccountsSchema = z.object({
  userId: z.number().int().positive(),
});

const DeleteAccountSchema = z.object({
  userId: z.number().int().positive(),
  accountId: z.number().int().positive(),
});

// createAccount: crée un compte (userId, amount)
export async function createAccount(data) {
  const result = CreateAccountSchema.safeParse(data);
  if (!result.success) throw new HttpBadRequest(result.error);

  const { userId, amount } = result.data;
  return createAccountInRepository({ userId, amount });
}

// getAccounts: retourne les comptes d'un utilisateur
export async function getAccounts(data) {
  const result = GetAccountsSchema.safeParse(data);
  if (!result.success) throw new HttpBadRequest(result.error);

  return getAccountsByUserIdFromRepository(result.data.userId);
}

// deleteAccount: supprime un compte par (userId, accountId)
export async function deleteAccount(data) {
  const result = DeleteAccountSchema.safeParse(data);
  if (!result.success) throw new HttpBadRequest(result.error);

  const deleted = await deleteAccountByIdForUserInRepository({
    userId: result.data.userId,
    accountId: result.data.accountId,
  });

  if (!deleted || (typeof deleted === "number" && deleted === 0)) {
    throw new HttpNotFound("Account not found for this user.");
  }

  return deleted;
}
