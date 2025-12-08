/**
 * @description Get all users
 * @route GET /api/v1/admin
 * @access Private -Admin
 */
export function getAllUsers(req: any, res: any): Promise<void>;
export function getUserByEmail(req: any, res: any): Promise<void>;
/**
//  * @description Delete user by ID
//  * @route DELETE /api/v1/admin/:id
//  * @access Private -Admin
//  */
export function deleteUserByEmail(req: any, res: any): Promise<void>;
/**
 * @description Update user by EMAIL
 * @route PATCH /api/v1/admin/:emailId
 * @access Private -Admin
 */
export function updateUserById(req: any, res: any): Promise<void>;
/**
 * @description Create a new user
 * @route POST /api/v1/admin
 * @access Private -Admin
 */
export function createUser(req: any, res: any): Promise<void>;
//# sourceMappingURL=adminUserControllers.d.ts.map