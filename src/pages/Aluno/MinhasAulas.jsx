import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";

// Dados de exemplo das aulas
const sampleClasses = [
 { id: 1, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
 { id: 2, title: 'Yoga Avançado', date: '03/09', teacher: 'Prof. Carlos Silva', studio: 'Estudio Paz' },
 { id: 3, title: 'Alongamento', date: '04/09', teacher: 'Prof. Mariana Costa', studio: 'Estudio Flex' },
 { id: 4, title: 'Pilates Intermediário', date: '05/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
 { id: 5, title: 'Meditação Guiada', date: '06/09', teacher: 'Prof. João Medeiros', studio: 'Estudio Zen' },
 { id: 6, title: 'Pilates Avançado', date: '07/09', teacher: 'Prof. Ricardo Lima', studio: 'Estudio Ghibli' },
 { id: 7, title: 'Yoga para Iniciantes', date: '08/09', teacher: 'Prof. Carla Santos', studio: 'Estudio Paz' },
 { id: 8, title: 'Pilates Funcional', date: '09/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
 { id: 9, title: 'Alongamento Profundo', date: '10/09', teacher: 'Prof. Mariana Costa', studio: 'Estudio Flex' },
 { id: 10, title: 'Meditação Avançada', date: '11/09', teacher: 'Prof. João Medeiros', studio: 'Estudio Zen' },
 { id: 11, title: 'Pilates Terapêutico', date: '12/09', teacher: 'Prof. Ricardo Lima', studio: 'Estudio Ghibli' },
 { id: 12, title: 'Yoga Restaurativo', date: '13/09', teacher: 'Prof. Carla Santos', studio: 'Estudio Paz' }
];

export default function MinhasAulas({ classes = sampleClasses }) {
 const [currentPage, setCurrentPage] = useState(0);
 const [isAnimating, setIsAnimating] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const { isMobile, sidebarWidth } = useSidebar();
 const trackRef = useRef(null);

 // Calcula itens por página com base se é mobile ou não (do contexto)
 const getItemsPerPage = () => {
   // Use isMobile diretamente do useSidebar hook
   if (isMobile) {
     return 4;
   }
   return 8;
 };

 // Função para paginar as aulas
 const paginateClasses = (classesArray, itemsPerPage) => {
   const pages = [];
   for (let i = 0; i < classesArray.length; i += itemsPerPage) {
     pages.push(classesArray.slice(i, i + itemsPerPage));
   }
   return pages;
 };

 const itemsPerPage = getItemsPerPage();
 const pages = paginateClasses(classes, itemsPerPage);
 const pagesCount = pages.length;

 // Função para navegar entre páginas do carrossel
 const goToPage = (index) => {
   if (index === currentPage || index < 0 || index >= pagesCount) return;
   setIsAnimating(true);
   setCurrentPage(index);
   setTimeout(() => setIsAnimating(false), 450); // Tempo da animação
 };

 // Navegação por teclado (setas)
 useEffect(() => {
   const onKey = (e) => {
     if (e.key === 'ArrowRight') goToPage(Math.min(currentPage + 1, pagesCount - 1));
     if (e.key === 'ArrowLeft') goToPage(Math.max(currentPage - 1, 0));
   };
   window.addEventListener('keydown', onKey);
   return () => window.removeEventListener('keydown', onKey);
 }, [currentPage, pagesCount]);

 return (
   // Container principal que inclui a sidebar e o conteúdo
   <div className="flex min-h-screen bg-gray-50 font-inter">
     {/* Componente da Sidebar */}
     <SidebarUnificada
       menuItems={sidebarConfigs.aluno.menuItems}
       userInfo={sidebarConfigs.aluno.userInfo}
       isOpen={menuOpen}
       onOpenChange={setMenuOpen}
     />

     {/* Container do conteúdo principal que se ajusta à sidebar */}
     <div
       className="flex flex-col flex-1 transition-all duration-300 min-w-0"
       style={{
         marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
         width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
       }}
     >
       {/* Conteúdo específico da página MinhasAulas */}
       <main className="flex-1 flex items-center justify-center py-4 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8"> {/* Mantido items-center justify-center */}
         {/* Container do carrossel/grid de aulas - Estilos do container externo revertidos */}
         <div className={`relative bg-white rounded-lg shadow-lg flex flex-col ${isMobile ? 'w-full mx-4 my-2' : 'w-[1448px] h-[780px]'}`}> {/* Tamanho fixo restaurado */}

           {/* Cabeçalho */}
           <div className={`flex justify-center ${isMobile ? 'px-4 pt-4' : 'px-8 pt-6'}`}>
             <h2 className={`font-semibold text-black ${isMobile ? 'text-2xl' : 'text-[34px]'}`}> {/* text-black restaurado */}
               Aulas do Mês
             </h2>
           </div>

           {/* Área de conteúdo do carrossel */}
           <div className={`flex flex-col flex-grow ${isMobile ? 'p-2' : 'px-10 py-6'}`}>

             {/* Viewport do slider */}
             <div className="relative overflow-hidden flex-grow">

               {/* Track do slider */}
               <div
                 ref={trackRef}
                 className="flex h-full"
                 style={{
                   width: `${pagesCount * 100}%`,
                   transform: `translateX(-${currentPage * (100 / pagesCount)}%)`,
                   transition: isAnimating ? 'transform 420ms ease' : 'none'
                 }}
               >
                 {/* Renderiza cada página de aulas */}
                 {pages.map((pageClasses, pageIndex) => (
                   <div
                     key={pageIndex}
                     className="flex-shrink-0 w-full" // Garante que cada página ocupe 100%
                     style={{ width: `${100 / pagesCount}%`, padding: isMobile ? '4px' : '8px' }}
                   >
                     {/* Grid responsivo */}
                     <div className={`w-full h-full flex items-start justify-center`}> {/* justify-center restaurado */}
                       <div className={`
                         ${isMobile
                           ? 'flex flex-col gap-4 w-full'
                           : 'grid grid-cols-4 gap-x-6 gap-y-6 w-full' // Grid original
                         }
                       `}>
                         {/* Mapeia e renderiza cada card de aula - TOTALMENTE REVERTIDO */}
                         {pageClasses.map((c) => (
                           <article
                             key={`${pageIndex}-${c.id}`}
                             className={`
                               bg-[#FEFEFE] border border-black rounded-lg shadow-md p-4 box-border
                               flex flex-col justify-between items-center text-center
                               ${isMobile ? 'w-full' : 'w-[324px]'}
                             `}
                             style={{
                               height: isMobile ? '210px' : '240px',
                               margin: '0 auto'
                             }}
                           >
                             {/* Div para agrupar o conteúdo superior */}
                             <div>
                               {/* Título */}
                               <h3
                                 className="font-medium text-black leading-tight"
                                 style={{
                                   fontSize: isMobile ? '20px' : '28px',
                                   lineHeight: isMobile ? '24px' : '34px',
                                   wordBreak: 'break-word',
                                   overflow: 'hidden',
                                   display: '-webkit-box',
                                   WebkitLineClamp: 2,
                                   WebkitBoxOrient: 'vertical'
                                 }}
                               >
                                 {c.title}
                               </h3>
                               {/* Data */}
                               <p
                                 className="font-medium mt-2"
                                 style={{
                                   fontSize: isMobile ? '20px' : '28px',
                                   lineHeight: isMobile ? '24px' : '34px',
                                   color: '#67AF97',
                                 }}
                               >
                                 {c.date}
                               </p>
                               {/* Professor */}
                               <p
                                 className="font-medium mt-2"
                                 style={{
                                   fontSize: isMobile ? '16px' : '22px',
                                   lineHeight: isMobile ? '20px' : '26px',
                                   color: '#000',
                                   wordBreak: 'break-word',
                                   overflow: 'hidden',
                                   display: '-webkit-box',
                                   WebkitLineClamp: 1,
                                   WebkitBoxOrient: 'vertical'
                                 }}
                               >
                                 {c.teacher}
                               </p>
                               {/* Estúdio */}
                               <p
                                 className="font-medium mt-2"
                                 style={{
                                   fontSize: isMobile ? '16px' : '22px',
                                   lineHeight: isMobile ? '20px' : '26px',
                                   color: '#000',
                                   wordBreak: 'break-word',
                                   overflow: 'hidden',
                                   display: '-webkit-box',
                                   WebkitLineClamp: 1,
                                   WebkitBoxOrient: 'vertical'
                                 }}
                               >
                                 {c.studio}
                               </p>
                             </div>

                             {/* Botão Reagendar */}
                             <button
                               className="px-4 py-2 rounded-md font-medium text-white hover:opacity-90 transition-opacity"
                               style={{
                                 backgroundColor: '#67AF97',
                                 fontSize: isMobile ? '16px' : '16px',
                               }}
                             >
                               Reagendar
                             </button>
                           </article>
                         ))}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Paginação */}
             {pagesCount > 1 && (
               <div className="flex justify-center w-full pt-6 pb-4 md:pt-8 md:pb-6">
                 <div className="flex gap-4 items-center"> {/* Gap original restaurado */}
                   <button
                     onClick={() => goToPage(currentPage - 1)}
                     disabled={currentPage === 0}
                     className={`w-8 h-8 border rounded-md flex items-center justify-center font-medium ${
                       currentPage === 0
                         ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                         : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50' // Estilo original
                     }`}
                     aria-label="Página anterior"
                   >
                     ←
                   </button>
                   {Array.from({ length: pagesCount }).map((_, idx) => {
                     const active = idx === currentPage;
                     return (
                       <button
                         key={idx}
                         onClick={() => goToPage(idx)}
                         className={`w-[27px] h-[30px] border rounded-md flex items-center justify-center font-medium ${ // Tamanho original
                           active
                             ? 'bg-[#67AF97] border-[#67AF97] text-white'
                             : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50' // Estilo original
                         }`}
                         aria-current={active ? 'page' : undefined} // Corrigido aria-current
                         aria-label={`Página ${idx + 1}`}
                       >
                         {idx + 1}
                       </button>
                     );
                   })}
                   <button
                     onClick={() => goToPage(currentPage + 1)}
                     disabled={currentPage === pagesCount - 1}
                     className={`w-8 h-8 border rounded-md flex items-center justify-center font-medium ${
                       currentPage === pagesCount - 1
                         ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                         : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50' // Estilo original
                     }`}
                     aria-label="Próxima página"
                   >
                     →
                   </button>
                 </div>
               </div>
             )}
           </div>
         </div>
       </main>
     </div>
   </div>
 );
}