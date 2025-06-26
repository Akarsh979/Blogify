import { cn } from "@/lib/utils"; // cn comes with shadcn and combines className

interface ContainerProps{
   children: React.ReactNode,
   className?: string,
}

function Container({children,className}:ContainerProps){
   return (
      <div className={cn("container mx-auto px-4",className)}>
      {children}
      </div>
   );
}

export default Container;