import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="not-found"><Image src="/images/earth-orbit.webp" fill priority sizes="100vw" alt="어두운 우주에서 바라본 푸른 지구" /><div className="not-found-overlay" /><div><span>404</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 삭제된 페이지입니다.</p><Link href="/"><ArrowLeft size={15} /> 블로그 홈으로</Link></div></section>;
}
