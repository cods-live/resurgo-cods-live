import Image from "next/image";

export default function Home() {
  return (
    <div className="wrapper">
      <header className="page-header">
        <div className="text-lg text-center">social network concept</div>
        <div className="text-center"><strong>resurgō</strong></div>
      </header>
      <main className="page-main flex flex-col items-center gap-10 justify-center">
        <div>Welcome</div>
        <div>My promise is:</div>
        <div>humane, real, honest,</div>
        
      </main>
      <footer className="page-footer self-center">
        <p>social network concept <strong>resurgō</strong> - by ZenitoGR</p>
      </footer>
    </div>
  );
}
