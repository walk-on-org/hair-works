import { usePathname } from "next/navigation";

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();

  const checkPath = path.startsWith("#");

  // TODO 最後にスラッシュいらない
  //const currentPath = path === "/" ? "/" : `${path}/`;
  const currentPath = path === "/" ? "/" : `${path}`;

  const normalActive = !checkPath && pathname === currentPath;

  const deepActive = !checkPath && pathname.includes(currentPath);

  return deep ? deepActive : normalActive;
}
