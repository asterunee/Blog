import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() { return <section className="not-found"><Image src="/images/earth-orbit.webp" fill priority sizes="100vw" alt="궤도 너머로 멀어지는 푸른 지구" /><div className="not-found-overlay" /><div><span>ERROR / ORBIT 404</span><h1>This orbit<br />leads nowhere.</h1><p>요청한 기록은 이 궤도에서 발견되지 않았습니다.</p><Link href="/"><ArrowLeft size={15} /> 관측소로 돌아가기</Link></div></section>; }
