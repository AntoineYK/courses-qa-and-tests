// @ts-nocheck
import {
  createAccountInRepository,
  deleteAccountInRepository,
  getAccountsFromRepository,
} from "./account.repository.js";

export async function createAccount(data) {
  if (!data.userId || !data.balance || !data.currency) {
    throw new Error("Missing required fields for account creation");
  }
  return await createAccountInRepository(data);
}

export async function getAccounts(userId) {
  if (!userId) {
    throw new Error("Missing userId");
  }
  return await getAccountsFromRepository(userId);
}

export async function deleteAccount(userId, accountId) {
  if (!userId || !accountId) {
    throw new Error("Missing userId or accountId");
  }
  return await deleteAccountInRepository(userId, accountId);
}
