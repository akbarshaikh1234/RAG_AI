const Chat = () => {

    return (
        <div className="h-screen grid grid-cols-1 grid-rows-[1fr_auto]">
            <div className="p-4 overflow-y-scroll">
                <p></p>
            </div>
            <div className="border-t border-gray-300 grid grid-cols-[1fr_auto] items-center justify-between pr-5">
                <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="bg-transparent border-none focus:outline-none w-full p-5" />

                    <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:outline-none">
                        Send
                    </button>
            </div>

        </div>
    )
}

export default Chat;