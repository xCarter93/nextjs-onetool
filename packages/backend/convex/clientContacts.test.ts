import { convexTest } from "convex-test";
import { describe, it, expect, beforeEach } from "vitest";
import { api } from "./_generated/api";
import { setupConvexTest } from "./test.setup";
import {
	createTestOrg,
	createTestClient,
	createTestIdentity,
	createTestClientContact,
} from "./test.helpers";

describe("ClientContacts", () => {
	let t: ReturnType<typeof convexTest>;

	beforeEach(() => {
		t = setupConvexTest();
	});

	describe("create", () => {
		it("should create a contact with valid data", async () => {
			const { orgId, clerkUserId, clerkOrgId, clientId } = await t.run(
				async (ctx) => {
					const testOrg = await createTestOrg(ctx);
					const clientId = await createTestClient(ctx, testOrg.orgId);
					return { ...testOrg, clientId };
				}
			);

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const contactId = await asUser.mutation(api.clientContacts.create, {
				clientId,
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "555-123-4567",
				jobTitle: "CEO",
				isPrimary: true,
			});

			expect(contactId).toBeDefined();

			const contact = await asUser.query(api.clientContacts.get, {
				id: contactId,
			});
			expect(contact).toMatchObject({
				firstName: "John",
				lastName: "Doe",
				email: "john.doe@example.com",
				phone: "555-123-4567",
				jobTitle: "CEO",
				isPrimary: true,
				clientId,
				orgId,
			});
		});

		it("should create contact with minimal required fields", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const contactId = await asUser.mutation(api.clientContacts.create, {
				clientId,
				firstName: "Jane",
				lastName: "Smith",
				isPrimary: false,
			});

			expect(contactId).toBeDefined();

			const contact = await asUser.query(api.clientContacts.get, {
				id: contactId,
			});
			expect(contact).toMatchObject({
				firstName: "Jane",
				lastName: "Smith",
				isPrimary: false,
			});
			expect(contact?.email).toBeUndefined();
			expect(contact?.phone).toBeUndefined();
		});

		it("should throw error for invalid email format", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			await expect(
				asUser.mutation(api.clientContacts.create, {
					clientId,
					firstName: "John",
					lastName: "Doe",
					email: "invalid-email",
					isPrimary: false,
				})
			).rejects.toThrowError("Invalid email format");
		});
	});

	describe("list", () => {
		it("should return empty array when no contacts exist", async () => {
			const { clerkUserId, clerkOrgId } = await t.run(async (ctx) => {
				return await createTestOrg(ctx);
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const contacts = await asUser.query(api.clientContacts.list, {});
			expect(contacts).toEqual([]);
		});

		it("should return all contacts for organization", async () => {
			const { clerkUserId, clerkOrgId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "John",
					lastName: "Doe",
				});
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Jane",
					lastName: "Smith",
				});
				return testOrg;
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const contacts = await asUser.query(api.clientContacts.list, {});
			expect(contacts).toHaveLength(2);
		});
	});

	describe("listByClient", () => {
		it("should return only contacts for specific client", async () => {
			const { clerkUserId, clerkOrgId, clientId1, clientId2 } = await t.run(
				async (ctx) => {
					const testOrg = await createTestOrg(ctx);
					const clientId1 = await createTestClient(ctx, testOrg.orgId, {
						companyName: "Client 1",
					});
					const clientId2 = await createTestClient(ctx, testOrg.orgId, {
						companyName: "Client 2",
					});

					// Create contacts for client 1
					await createTestClientContact(ctx, testOrg.orgId, clientId1, {
						firstName: "John",
					});
					await createTestClientContact(ctx, testOrg.orgId, clientId1, {
						firstName: "Jane",
					});

					// Create contact for client 2
					await createTestClientContact(ctx, testOrg.orgId, clientId2, {
						firstName: "Bob",
					});

					return { ...testOrg, clientId1, clientId2 };
				}
			);

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const client1Contacts = await asUser.query(api.clientContacts.listByClient, {
				clientId: clientId1,
			});
			expect(client1Contacts).toHaveLength(2);

			const client2Contacts = await asUser.query(api.clientContacts.listByClient, {
				clientId: clientId2,
			});
			expect(client2Contacts).toHaveLength(1);
			expect(client2Contacts[0].firstName).toBe("Bob");
		});
	});

	describe("update", () => {
		it("should update contact fields", async () => {
			const { clerkUserId, clerkOrgId, contactId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				const contactId = await createTestClientContact(
					ctx,
					testOrg.orgId,
					clientId,
					{
						firstName: "Original",
						lastName: "Name",
						email: "original@example.com",
					}
				);
				return { ...testOrg, contactId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			await asUser.mutation(api.clientContacts.update, {
				id: contactId,
				firstName: "Updated",
				lastName: "Contact",
				email: "updated@example.com",
				jobTitle: "CTO",
			});

			const contact = await asUser.query(api.clientContacts.get, {
				id: contactId,
			});
			expect(contact).toMatchObject({
				firstName: "Updated",
				lastName: "Contact",
				email: "updated@example.com",
				jobTitle: "CTO",
			});
		});

		it("should throw error when no updates provided", async () => {
			const { clerkUserId, clerkOrgId, contactId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				const contactId = await createTestClientContact(
					ctx,
					testOrg.orgId,
					clientId
				);
				return { ...testOrg, contactId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			await expect(
				asUser.mutation(api.clientContacts.update, {
					id: contactId,
				})
			).rejects.toThrowError("No valid updates provided");
		});
	});

	describe("remove", () => {
		it("should delete a contact", async () => {
			const { clerkUserId, clerkOrgId, contactId, clientId } = await t.run(
				async (ctx) => {
					const testOrg = await createTestOrg(ctx);
					const clientId = await createTestClient(ctx, testOrg.orgId);
					const contactId = await createTestClientContact(
						ctx,
						testOrg.orgId,
						clientId
					);
					return { ...testOrg, contactId, clientId };
				}
			);

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			// Verify contact exists
			const beforeDelete = await asUser.query(api.clientContacts.get, {
				id: contactId,
			});
			expect(beforeDelete).toBeDefined();

			// Delete the contact
			await asUser.mutation(api.clientContacts.remove, { id: contactId });

			// Verify contact is deleted
			const afterDelete = await asUser.query(api.clientContacts.listByClient, {
				clientId,
			});
			expect(afterDelete).toHaveLength(0);
		});
	});

	describe("isPrimary constraint", () => {
		it("should ensure only one primary contact per client", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			// Create first primary contact
			const firstContactId = await asUser.mutation(api.clientContacts.create, {
				clientId,
				firstName: "First",
				lastName: "Primary",
				isPrimary: true,
			});

			// Verify first contact is primary
			let firstContact = await asUser.query(api.clientContacts.get, {
				id: firstContactId,
			});
			expect(firstContact?.isPrimary).toBe(true);

			// Create second primary contact
			const secondContactId = await asUser.mutation(api.clientContacts.create, {
				clientId,
				firstName: "Second",
				lastName: "Primary",
				isPrimary: true,
			});

			// Verify second contact is now primary
			const secondContact = await asUser.query(api.clientContacts.get, {
				id: secondContactId,
			});
			expect(secondContact?.isPrimary).toBe(true);

			// Verify first contact is no longer primary
			firstContact = await asUser.query(api.clientContacts.get, {
				id: firstContactId,
			});
			expect(firstContact?.isPrimary).toBe(false);
		});

		it("should update isPrimary and unset previous primary", async () => {
			const { clerkUserId, clerkOrgId, contactId1, contactId2 } = await t.run(
				async (ctx) => {
					const testOrg = await createTestOrg(ctx);
					const clientId = await createTestClient(ctx, testOrg.orgId);
					const contactId1 = await createTestClientContact(
						ctx,
						testOrg.orgId,
						clientId,
						{ firstName: "First", isPrimary: true }
					);
					const contactId2 = await createTestClientContact(
						ctx,
						testOrg.orgId,
						clientId,
						{ firstName: "Second", isPrimary: false }
					);
					return { ...testOrg, contactId1, contactId2 };
				}
			);

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			// Update second contact to be primary
			await asUser.mutation(api.clientContacts.update, {
				id: contactId2,
				isPrimary: true,
			});

			// Verify second is now primary
			const second = await asUser.query(api.clientContacts.get, {
				id: contactId2,
			});
			expect(second?.isPrimary).toBe(true);

			// Verify first is no longer primary
			const first = await asUser.query(api.clientContacts.get, {
				id: contactId1,
			});
			expect(first?.isPrimary).toBe(false);
		});
	});

	describe("getPrimaryContact", () => {
		it("should return primary contact for client", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "NonPrimary",
					isPrimary: false,
				});
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Primary",
					isPrimary: true,
				});
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const primary = await asUser.query(api.clientContacts.getPrimaryContact, {
				clientId,
			});
			expect(primary).toBeDefined();
			expect(primary?.firstName).toBe("Primary");
			expect(primary?.isPrimary).toBe(true);
		});

		it("should return null when no primary contact exists", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					isPrimary: false,
				});
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const primary = await asUser.query(api.clientContacts.getPrimaryContact, {
				clientId,
			});
			expect(primary).toBeNull();
		});
	});

	describe("setPrimary", () => {
		it("should set a contact as primary", async () => {
			const { clerkUserId, clerkOrgId, contactId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				const contactId = await createTestClientContact(
					ctx,
					testOrg.orgId,
					clientId,
					{ isPrimary: false }
				);
				return { ...testOrg, contactId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			await asUser.mutation(api.clientContacts.setPrimary, { id: contactId });

			const contact = await asUser.query(api.clientContacts.get, {
				id: contactId,
			});
			expect(contact?.isPrimary).toBe(true);
		});
	});

	describe("search", () => {
		it("should search contacts by name", async () => {
			const { clerkUserId, clerkOrgId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Alice",
					lastName: "Williams",
					email: "alice@test.com",
				});
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Bob",
					lastName: "Williams",
					email: "bob@test.com",
				});
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Charlie",
					lastName: "Brown",
					email: "charlie@test.com",
				});
				return testOrg;
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			// Search for "williams" should match Alice Williams and Bob Williams
			const results = await asUser.query(api.clientContacts.search, {
				query: "williams",
			});
			expect(results).toHaveLength(2);
		});

		it("should search contacts by email", async () => {
			const { clerkUserId, clerkOrgId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "John",
					email: "john@acme.com",
				});
				await createTestClientContact(ctx, testOrg.orgId, clientId, {
					firstName: "Jane",
					email: "jane@example.com",
				});
				return testOrg;
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const results = await asUser.query(api.clientContacts.search, {
				query: "acme",
			});
			expect(results).toHaveLength(1);
			expect(results[0].firstName).toBe("John");
		});
	});

	describe("bulkCreate", () => {
		it("should create multiple contacts", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			const contactIds = await asUser.mutation(api.clientContacts.bulkCreate, {
				clientId,
				contacts: [
					{ firstName: "John", lastName: "Doe", isPrimary: true },
					{ firstName: "Jane", lastName: "Smith", isPrimary: false },
					{ firstName: "Bob", lastName: "Wilson", isPrimary: false },
				],
			});

			expect(contactIds).toHaveLength(3);

			const contacts = await asUser.query(api.clientContacts.listByClient, {
				clientId,
			});
			expect(contacts).toHaveLength(3);
		});

		it("should throw error when multiple contacts marked as primary", async () => {
			const { clerkUserId, clerkOrgId, clientId } = await t.run(async (ctx) => {
				const testOrg = await createTestOrg(ctx);
				const clientId = await createTestClient(ctx, testOrg.orgId);
				return { ...testOrg, clientId };
			});

			const asUser = t.withIdentity(createTestIdentity(clerkUserId, clerkOrgId));

			await expect(
				asUser.mutation(api.clientContacts.bulkCreate, {
					clientId,
					contacts: [
						{ firstName: "John", lastName: "Doe", isPrimary: true },
						{ firstName: "Jane", lastName: "Smith", isPrimary: true },
					],
				})
			).rejects.toThrowError("Only one contact can be marked as primary");
		});
	});

	describe("organization isolation", () => {
		it("should not return contacts from other organizations", async () => {
			const { clerkUserId1, clerkOrgId1, clerkUserId2, clerkOrgId2 } =
				await t.run(async (ctx) => {
					// Create first org with contacts
					const org1 = await createTestOrg(ctx, {
						clerkUserId: "user_org1",
						clerkOrgId: "org_1",
					});
					const client1 = await createTestClient(ctx, org1.orgId);
					await createTestClientContact(ctx, org1.orgId, client1, {
						firstName: "Org1Contact",
					});

					// Create second org with contacts
					const org2 = await createTestOrg(ctx, {
						clerkUserId: "user_org2",
						clerkOrgId: "org_2",
						userName: "User 2",
						userEmail: "user2@example.com",
						orgName: "Org 2",
					});
					const client2 = await createTestClient(ctx, org2.orgId);
					await createTestClientContact(ctx, org2.orgId, client2, {
						firstName: "Org2Contact",
					});

					return {
						clerkUserId1: org1.clerkUserId,
						clerkOrgId1: org1.clerkOrgId,
						clerkUserId2: org2.clerkUserId,
						clerkOrgId2: org2.clerkOrgId,
					};
				});

			// User from org1 should only see org1 contacts
			const asUser1 = t.withIdentity(
				createTestIdentity(clerkUserId1, clerkOrgId1)
			);
			const org1Contacts = await asUser1.query(api.clientContacts.list, {});
			expect(org1Contacts).toHaveLength(1);
			expect(org1Contacts[0].firstName).toBe("Org1Contact");

			// User from org2 should only see org2 contacts
			const asUser2 = t.withIdentity(
				createTestIdentity(clerkUserId2, clerkOrgId2)
			);
			const org2Contacts = await asUser2.query(api.clientContacts.list, {});
			expect(org2Contacts).toHaveLength(1);
			expect(org2Contacts[0].firstName).toBe("Org2Contact");
		});

		it("should not allow accessing contacts from other organizations", async () => {
			const { clerkUserId2, clerkOrgId2, contactId1 } = await t.run(
				async (ctx) => {
					// Create first org with a contact
					const org1 = await createTestOrg(ctx, {
						clerkUserId: "user_org1",
						clerkOrgId: "org_1",
					});
					const client1 = await createTestClient(ctx, org1.orgId);
					const contactId1 = await createTestClientContact(
						ctx,
						org1.orgId,
						client1
					);

					// Create second org
					const org2 = await createTestOrg(ctx, {
						clerkUserId: "user_org2",
						clerkOrgId: "org_2",
						userName: "User 2",
						userEmail: "user2@example.com",
						orgName: "Org 2",
					});

					return {
						clerkUserId2: org2.clerkUserId,
						clerkOrgId2: org2.clerkOrgId,
						contactId1,
					};
				}
			);

			// User from org2 should not be able to get org1's contact
			const asUser2 = t.withIdentity(
				createTestIdentity(clerkUserId2, clerkOrgId2)
			);
			await expect(
				asUser2.query(api.clientContacts.get, { id: contactId1 })
			).rejects.toThrowError("Contact does not belong to your organization");
		});
	});
});
