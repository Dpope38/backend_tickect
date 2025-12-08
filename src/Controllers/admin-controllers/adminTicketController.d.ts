/**
 * @description Get all tickets
 * @route GET /api/v1/admin/tickets
 * @access Private -Admin
 *
 *
 */
export function getAllTickets(req: any, res: any): Promise<void>;
/**
 * @description Get ticket by ID
 * @route GET /api/v1/admin/tickets/:id
 * @access Private -Admin
 */
export function getTicketByRefCode(req: any, res: any): Promise<void>;
/**
 * @description Update ticket status and assigned to agent by ID
 * @route PATCH /api/v1/admin/tickets/:id by
 * @access Private -Admin
 */
export function updateSingleTicket(req: any, res: any): Promise<any>;
//# sourceMappingURL=adminTicketController.d.ts.map