import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
async function populateKanBan() {
    const COLUMNS = ['ToDo', 'In progress', 'Finish']
    const columns = await Promise.all(COLUMNS.map(async (c, i) => {
        const column = await prisma.kanbanColumn.findFirst({where: {name: c, order: i}})
        if (column === null) {
            return prisma.kanbanColumn.create({
                data: {
                    name: c,
                    order: i,
                }
            })
        }
    }))
    Array.from({length: 15}, (_, i) => i).map(async i => {
        const columnId = columns[i % 3]?.id
        if (!columnId) {return }

        const title = `Ticket ${i}`
        const ticket = await prisma.kanbanTicket.findFirst({where: {title}})
        if (ticket === null) {
            await prisma.kanbanTicket.create({
                data: {
                    title,
                    columnId,
                }
            })
        }
    })

}


async function main() {
    return Promise.all([
        populateKanBan(),
    ])
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })