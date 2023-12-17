import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="bg-base-200 border-base-content/10 fixed bottom-0 left-0 right-0 z-0 border-t">
            <div className="mx-auto max-w-7xl px-8 py-2">
                <div className="flex flex-wrap md:flex-row md:flex-nowrap lg:items-center lg:justify-between">
                    <div className="">
                        <p className="text-sm font-normal text-zinc-400">
                            @ Gptnomics 2024
                        </p>
                    </div>
                    <div>
                        <Link
                            href={'https://twitter.com/ItsKrisKriz'}
                            target="_blank"
                            className="text-sm font-normal text-zinc-500"
                        >
                            Made by Kris 👽
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
