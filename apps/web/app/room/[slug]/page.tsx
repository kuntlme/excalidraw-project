import React from 'react'
import ChatRoomClinet from '../../../components/chatRoomClinet';

type Params = {
    slug?: string; // Explicitly type the slug as string | undefined
};

async function page({ params }:any) {
    // const param = useParams<Params>();
    const slug = (await params).slug;
    return (
        <div>
            <ChatRoomClinet id="1" messages={[{message: "hii"}]}/>
            {slug}
        </div>
    )
}

export default page