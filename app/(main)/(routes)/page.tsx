import { UserButton } from "@clerk/nextjs";
 
export default function Home() {
  return (
    <>
      <header>
        <UserButton />
      </header>
      <div>Your home page content can go here.</div>
    </>
  );
}