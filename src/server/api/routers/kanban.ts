import {createTRPCRouter, publicProcedure} from '@/server/api/trpc'
import {z} from 'zod'


export const kanbanRouter = createTRPCRouter({
    columns: publicProcedure.query(async ({ctx}) => {
        return ctx.prisma.kanbanColumn.findMany({
            orderBy: {order: 'asc'}
        })
    }),
    ticketByColumn: publicProcedure.input(z.object({columnId: z.string().cuid()})).query(async ({ctx, input}) => {
        return ctx.prisma.kanbanTicket.findMany({where: input, orderBy: {order: 'asc'}})
    }),
    moveTicketToColumn: publicProcedure.input(z.object({
        columnId: z.string(),
        id: z.string(),
        order: z.number(),
    })).mutation(async ({ctx, input}) => {
        return ctx.prisma.kanbanTicket.update({
            where: {id: input.id},
            data: {
                columnId: input.columnId,
                order: input.order,
            },
        })
    }),
    createOrUpdateTicket: publicProcedure.input(z.object({
        id: z.string().cuid().optional(),
        title: z.string().min(1).max(200),
        columnId: z.string().cuid(),
    })).mutation(async ({ctx, input}) => {
        const {id, ...rest} = input
        const ticket = id ?
            await ctx.prisma.kanbanTicket.upsert({
                where: {id},
                create: rest,
                update: rest,
            })
            : await ctx.prisma.kanbanTicket.create({data: rest})

        return ticket
    }),
    reorderColumns: publicProcedure.input(z.object({
        columns: z.array(z.object({id: z.string().cuid(), order: z.number()}))
    }))
        .mutation(async ({ctx, input}) => {
            await new Promise(r => setTimeout(r, 3000))
            return await ctx.prisma.$transaction(
                input.columns.map(column =>
                    ctx.prisma.kanbanColumn.update({
                        where: {id: column.id},
                        data: {order: column.order}
                    }))
            )
        }),
})