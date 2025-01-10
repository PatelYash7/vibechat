import ChatPage from "@/components/chat/ChatPage";
import { getToken } from "next-auth/jwt";

export default async function Page() {
	// const token = await getToken();
	return <div>
		<ChatPage/>
	</div>	
}
