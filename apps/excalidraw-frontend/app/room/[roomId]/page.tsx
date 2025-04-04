import RoomCanvas from '@/components/roomCanvas';

interface Params {
  params: {
    roomId: string
  }
}

async function page({ params }: Params) {
  const roomId = (await params).roomId;

  return (<div>
    <RoomCanvas roomId={roomId} />
  </div>)
}

export default page