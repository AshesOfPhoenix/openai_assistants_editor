import { cn } from '@/lib/utils'
import { LightningBoltIcon } from '@radix-ui/react-icons'

export const GPT4 = () => {
    return (
        <div
            className={cn(
                `flex items-center justify-center`, // layout
                `fixed left-0 top-0 py-4 lg:static lg:px-4 lg:py-2`, // positioning
                `h-9 w-full lg:w-auto`, // size
                `cursor-pointer border-b border-gray-300 backdrop-blur-2xl lg:rounded-lg lg:border`, // style
                `bg-gradient-to-b from-zinc-200 lg:bg-gray-200`, // colors
                `hover:shadow-md lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200`, // hover
                `dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30` // theme
            )}
        >
            <span>GPT-4 Inside</span>{' '}
            <LightningBoltIcon
                className="ml-2 text-yellow-500"
                width={20}
                height={20}
            />
        </div>
    )
}
