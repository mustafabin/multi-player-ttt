import dynamic from "next/dynamic";
const ClientSidePage = dynamic(() => import("./ClientSidePage"), { ssr: false});
export default function Normal() {
  return <ClientSidePage />
}
