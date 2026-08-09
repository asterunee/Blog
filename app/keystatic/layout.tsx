import KeystaticApp from "./keystatic";
import Link from "next/link";
import { keystaticGithubMode } from "@/keystatic.config";

export default function KeystaticLayout() {
  if (process.env.NODE_ENV === "production" && !keystaticGithubMode) return <div className="keystatic-shell admin-setup"><div><span>GITHUB CONNECTION REQUIRED</span><h1>기록장은 준비되었습니다.</h1><p>GitHub 저장소와 Keystatic GitHub App을 연결하면 이 화면에서 직접 풀이와 관측 일지를 작성할 수 있습니다.</p><ol><li><code>asterunee/Blog</code> 저장소 생성</li><li>GitHub App 환경변수 등록</li><li><code>NEXT_PUBLIC_KEYSTATIC_STORAGE=github</code> 설정 후 재배포</li></ol><Link href="/">블로그로 돌아가기</Link></div></div>;
  return <div className="keystatic-shell"><KeystaticApp /></div>;
}
