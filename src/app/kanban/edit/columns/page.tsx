'use client'
import {type RouterOutputs, api} from '@/utils/api'
import Link from 'next/link'
import {Fragment, useRef} from 'react'
import {DndProvider, useDrag, useDrop} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'


type Ticket = RouterOutputs['kanban']['ticketByColumn'][0]
type Column = RouterOutputs['kanban']['columns'][0]
export default function EditColumnPage() {
    const columns = api.kanban.columns.useQuery()


    return (

        <DndProvider backend={HTML5Backend}>
            <div className='flex flex-col gap-8'>
                <div className='flex'>
                    <Link href='/kanban' passHref>
                        <button className="btn btn-sm btn-primary">
                            Return
                        </button>
                    </Link>
                </div>
                <div className="flex flex-row gap-4">
                    {columns.data?.map((column, index, arr) => {
                        return (
                            <Fragment key={column.id}>
                                <Column column={column} key={column.id} columns={arr} index={index} />
                            </Fragment>

                        )
                    })}
                </div>
            </div>
        </DndProvider>
    )
}

function Column(props: {column: Column, columns: Column[], index: number}) {
    const {column, columns, index: columnIndex} = props
    const isFirst = columnIndex === 0
    const [collected, dragRef, dragPreview] = useDrag({
        type: 'BOX',
        item: column,
        collect: m => ({isDragging: m.isDragging()})
    })
    const utils = api.useContext()
    const mutate = api.kanban.reorderColumns.useMutation({
        onSuccess: () => {
            void utils.kanban.columns.invalidate()
        },
        onMutate: variables => {
            const oldColumnsOrder = utils.kanban.columns.getData()
            utils.kanban.columns.setData(undefined, (prev) => variables.columns.map(c => {
                const oldC = prev?.find(oldC => oldC.id === c.id)
                return ({...(oldC!), ...c})
            }))
            return {oldColumnsOrder}
        },
        onError(error, variables, context) {
            utils.kanban.columns.setData(undefined, context?.oldColumnsOrder)
        },
    })
    async function changeColumnOrder(columns: Column[]) {
        await mutate.mutateAsync({columns})
    }

    const [firstDropCollected, firstDropRef] = useDrop({
        accept: 'BOX',
        collect: monitor => ({isOver: monitor.isOver(), item: monitor.getItem<Column>()}),
        drop(droppedElement) {
            const item = droppedElement as Column
            const index = columns.findIndex(({id}) => id === item.id)
            if (index === -1) return
            if (columnIndex !== 0) return
            columns.splice(index, 1)
            const newColumns = [item, ...columns].map((c, order) => ({...c, order}))
            void changeColumnOrder(newColumns)
        },
    })

    const [nextDropCollected, nextDropRef] = useDrop({
        accept: 'BOX',
        collect: monitor => ({isOver: monitor.isOver(), item: monitor.getItem<Column>()}),
        drop(droppedElement) {
            const item = droppedElement as Column
            if (item.id === column.id) return
            const index = columns.findIndex(({id}) => id === item.id)
            if (index === -1) return
            columns.splice(index, 1)
            const currentColumIndex = columns.findIndex(({id}) => id === column.id)
            const prev = columns.slice(0, currentColumIndex)
            const nexts = columns.slice(currentColumIndex + 1, columns.length)
            const newColumns = [
                ...prev, column, item, ...nexts,
            ].map((c, order) => ({...c, order}))
            void changeColumnOrder(newColumns)

        },
    })
    return (
        <>
            {isFirst && (
                <div className={`flex flex-col gap-2 ${firstDropCollected.isOver && 'min-w-[10rem] opacity-25' || 'min-w-[8px]'} `} ref={firstDropRef}>
                    {firstDropCollected.isOver && (
                        <>
                            <div className='bg-slate-600 rounded-lg p-2'>
                                {firstDropCollected.item.name}
                            </div>
                            <div className="bg-slate-600 rounded-sm p-2 min-h-[10rem]">
                                <div
                                    className={`p-2 w-full h-full flex flex-col gap-2`}
                                >

                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            {collected.isDragging ? (
                <div className={`flex flex-col gap-2 min-w-[10rem] opacity-25`} ref={dragPreview}>
                    <div className='bg-slate-400 rounded-lg p-2'>
                        {column.name}
                    </div>
                    <div className="bg-slate-400 rounded-sm p-2 min-h-[10rem]">
                        <div className={`p-2 w-full h-full flex flex-col gap-2`} />
                    </div>
                </div >
            ) : (
                <div className={`flex flex-col gap-2 min-w-[10rem]`} ref={dragRef}>
                    <div className='bg-slate-600 rounded-lg p-2'>
                        {column.name}
                    </div>
                    <div className="bg-slate-600 rounded-sm p-2 min-h-[10rem]">
                        <div className={`p-2 w-full h-full flex flex-col gap-2`} />
                    </div>
                </div>
            )}
            <div className={`flex flex-col gap-2 ${nextDropCollected.isOver && 'min-w-[10rem] opacity-25' || 'min-w-[8px]'} `} ref={nextDropRef}>
                {nextDropCollected.isOver && (
                    <>
                        <div className='bg-slate-600 rounded-lg p-2'>
                            {nextDropCollected.item.name}
                        </div>
                        <div className="bg-slate-600 rounded-sm p-2 min-h-[10rem]">
                            <div
                                className={`p-2 w-full h-full flex flex-col gap-2`}
                            >

                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
