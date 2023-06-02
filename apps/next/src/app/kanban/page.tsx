'use client'
import {type RouterOutputs, api} from "@/utils/api"
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useId, useRef} from 'react'
import Link from 'next/link'

export default function HomePage() {
    const columns = api.kanban.columns.useQuery()

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='flex flex-col gap-8'>
                <div className='flex justify-end gap-4'>
                    <Link passHref href='/kanban/edit/columns'>
                        <button className='btn btn-sm btn-secondary'>Edit columns</button>
                    </Link>
                    <CreateTicketModal />
                </div>
                <div className="flex flex-row gap-4">
                    {columns.data?.map(column => (
                        <Column column={column} key={column.id} />
                    ))}
                </div>
            </div>
        </DndProvider>
    )
}


type Ticket = RouterOutputs['kanban']['ticketByColumn'][0]
type Column = RouterOutputs['kanban']['columns'][0]

function Column(props: {column: Column}) {
    const {column} = props
    const ticketContainerRef = useRef<HTMLDivElement>(null)
    const tickets = api.kanban.ticketByColumn.useQuery({columnId: column.id})
    const utils = api.useContext()
    const moveTicketToColumn = api.kanban.moveTicketToColumn.useMutation()
    type Collect = {opacity: number, isOver: boolean}
    const [collectedProps, dropRef] = useDrop<Ticket, unknown, Collect>(() => ({
        accept: 'BOX',
        collect: monitor => ({
            opacity: monitor.isOver() ? 0.5 : 1,
            isOver: monitor.isOver(),
        }),
        async drop(item, monitor) {
            await moveTicketToColumn.mutateAsync({
                id: item.id, columnId: column.id,
                order: ticketContainerRef.current?.childElementCount || 0
            })
            await utils.kanban.ticketByColumn.invalidate({columnId: item.columnId})
            await utils.kanban.ticketByColumn.invalidate({columnId: column.id})
        },
    }))
    return (
        <div className='flex flex-col gap-2 min-w-[10rem]'>
            <div className='bg-slate-600 rounded-lg p-2'>
                {column.name}
            </div>
            <div className="bg-slate-600 rounded-sm p-2 min-h-[10rem]" ref={dropRef} style={collectedProps}>
                <div
                    className={`p-2 w-full h-full flex flex-col gap-2 ${collectedProps.isOver && 'border border-dashed border-red-300' || ''}`}
                    ref={ticketContainerRef}
                >

                    {[...(tickets.data || []).sort((a, b) => a.order - b.order)].map(ticket => (
                        <Ticket ticket={ticket} key={ticket.id} />
                    ))}
                </div>
            </div>
        </div >
    )
}


function Ticket(props: {ticket: Ticket}) {
    const {ticket} = props
    type Collect = {
        opacity: number
        isDraging: boolean
    }
    const [{opacity, isDraging
    }, dragRef, dragPreview] = useDrag<Ticket, unknown, Collect>(() => ({
        type: 'BOX',
        item: ticket,
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1,
            isDraging: monitor.isDragging(),
        }),
    }))
    if (isDraging) {

        return <div ref={dragPreview} className='bg-red-400 p-2 rounded-md opacity-0 '>
            {ticket.title}
        </div>
    }

    return <div ref={dragRef} className='bg-slate-400 p-2 rounded-md' style={{opacity}}>
        {ticket.title}
    </div>
}



function CreateTicketModal(props: any) {
    const id = useId()
    const titleRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLInputElement>(null)
    const columnRef = useRef<HTMLSelectElement>(null)
    const utils = api.useContext()
    const mutate = api.kanban.createOrUpdateTicket.useMutation({
        onSuccess(data, variables, context) {
            void utils.kanban.ticketByColumn.invalidate({columnId: data.columnId})
            modalRef.current!.checked = false
            titleRef.current!.value = ''
        },
    })
    const columns = api.kanban.columns.useQuery()
    return (
        <>
            <label htmlFor={id} className="btn btn-sm btn-primary ">+ Create ticket</label>

            <input type="checkbox" id={id} className="modal-toggle" ref={modalRef} />
            <div className="modal">
                <div className="modal-box">
                    <label htmlFor={id} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <div className='flex flex-col gap-4'>
                        <h3 className="text-lg font-bold">New ticket</h3>
                        <input
                            type="text"
                            name="title"
                            ref={titleRef}
                            placeholder='Title'
                            className='input input-primary w-full'
                        />
                        <select className='select select-primary' ref={columnRef}>
                            {columns.data?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-action">
                        <label htmlFor={id} className="btn btn-ghost">Cancel</label>
                        <button

                            className='btn'
                            onClick={() => {
                                mutate.mutate({
                                    columnId: columnRef.current!.value,
                                    title: titleRef.current!.value,
                                })
                            }}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}