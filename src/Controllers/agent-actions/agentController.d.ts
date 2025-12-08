/**
 * @description GET Profile
 * @route GET /api/v1/agents/profile
 * @access Private -agent
 */
export function getProfile(req: any, res: any): Promise<void>;
/**
 * @description GET tickets assigned to agent
 * @route GET /api/v1/agents/ticket
 * @access Private -agent
 */
export function getAssignedTickets(req: any, res: any): Promise<void>;
/**
 * @description PATCH update ticket status
 * @route PATCH /api/v1/agents/tickets/:ticketId
 * @access Private -agent
 */
export function updateTicketStatus(req: any, res: any): Promise<void>;
//# sourceMappingURL=agentController.d.ts.map