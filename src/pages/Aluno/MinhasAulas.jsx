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

// Função auxiliar para formatar números com zero à esquerda
const formatWithZero = (num) => {
  return num < 10 ? '0' + num : num.toString();
};

// Componente do Popup de Reagendamento
function ReschedulePopup({ isOpen, onClose, classData, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Horários disponíveis para demonstração
  const availableTimes = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  useEffect(() => {
    if (isOpen && classData) {
      // Extrai data e hora dos dados atuais da aula (formato DD/MM)
      const [day, month] = classData.date.split('/');
      const currentYear = new Date().getFullYear();
      // CORREÇÃO: Usar formatWithZero em vez de padStart
      const formattedMonth = month && month.length === 1 ? '0' + month : month;
      const formattedDay = day && day.length === 1 ? '0' + day : day;
      setSelectedDate(`${currentYear}-${formattedMonth}-${formattedDay}`);
      setSelectedTime('08:00'); // Valor padrão
    }
  }, [isOpen, classData]);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      // Formata a data para o formato DD/MM usado no card
      const dateObj = new Date(selectedDate);
      // CORREÇÃO: Usar formatWithZero em vez de padStart
      const day = formatWithZero(dateObj.getDate());
      const month = formatWithZero(dateObj.getMonth() + 1);
      const formattedDate = `${day}/${month}`;
      
      onConfirm({
        ...classData,
        date: formattedDate,
        time: selectedTime // Adiciona o horário selecionado
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Reagendar Aula</h3>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Aula selecionada:</p>
            <p className="font-semibold text-lg text-gray-800">{classData?.title}</p>
            <p className="text-gray-600">Data atual: {classData?.date}</p>
          </div>

          <div className="space-y-4">
            {/* Seleção de Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Não permite datas passadas
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67AF97] focus:border-transparent"
              />
            </div>

            {/* Seleção de Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novo Horário
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67AF97] focus:border-transparent"
              >
                <option value="">Selecione um horário</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rodapé com botões */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="w-full sm:w-auto px-4 py-2 bg-[#67AF97] text-white rounded-md hover:bg-[#5a9c87] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reagendamento
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MinhasAulas({ classes = sampleClasses }) {
 const [currentPage, setCurrentPage] = useState(0);
 const [isAnimating, setIsAnimating] = useState(false);
 const [menuOpen, setMenuOpen] = useState(false);
 const [reschedulePopup, setReschedulePopup] = useState({ isOpen: false, classData: null });
 const [classesData, setClassesData] = useState(classes);
 const { isMobile, sidebarWidth } = useSidebar();
 const trackRef = useRef(null);

 // Função para ordenar as aulas por data (mais próximas primeiro)
 const sortClassesByDate = (classesArray) => {
   return [...classesArray].sort((a, b) => {
     // Converte datas DD/MM para objeto Date para comparação
     const [dayA, monthA] = a.date.split('/').map(Number);
     const [dayB, monthB] = b.date.split('/').map(Number);
     const year = new Date().getFullYear();
     
     const dateA = new Date(year, monthA - 1, dayA);
     const dateB = new Date(year, monthB - 1, dayB);
     
     return dateA.getTime() - dateB.getTime();
   });
 };

 // Atualiza a ordenação quando os dados mudam
 useEffect(() => {
   setClassesData(sortClassesByDate(classes));
 }, []);

 // Função para calcular itens por página de forma responsiva
 const getItemsPerPage = () => {
   if (isMobile) {
     return 4;
   }
   // Para telas menores que desktop grande, ajustar dinamicamente
   const width = window.innerWidth;
   if (width < 768) return 4; // mobile
   if (width < 1024) return 6; // tablet
   if (width < 1440) return 8; // desktop médio
   return 8; // desktop grande
 };

 // Função para paginar as aulas
 const paginateClasses = (classesArray, itemsPerPage) => {
   const pages = [];
   for (let i = 0; i < classesArray.length; i += itemsPerPage) {
     pages.push(classesArray.slice(i, i + itemsPerPage));
   }
   return pages;
 };

 const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
 const pages = paginateClasses(classesData, itemsPerPage);
 const pagesCount = pages.length;

 // Atualizar itens por página quando a janela for redimensionada
 useEffect(() => {
   const handleResize = () => {
     setItemsPerPage(getItemsPerPage());
   };

   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 // Função para navegar entre páginas do carrossel
 const goToPage = (index) => {
   if (index === currentPage || index < 0 || index >= pagesCount) return;
   setIsAnimating(true);
   setCurrentPage(index);
   setTimeout(() => setIsAnimating(false), 450);
 };

 // Função para abrir o popup de reagendamento
 const handleOpenReschedule = (classData) => {
   setReschedulePopup({ isOpen: true, classData });
 };

 // Função para fechar o popup de reagendamento
 const handleCloseReschedule = () => {
   setReschedulePopup({ isOpen: false, classData: null });
 };

 // Função para confirmar o reagendamento
 const handleConfirmReschedule = (updatedClass) => {
   // Atualiza a aula com a nova data
   setClassesData(prevClasses => {
     const updatedClasses = prevClasses.map(c => 
       c.id === updatedClass.id ? updatedClass : c
     );
     return sortClassesByDate(updatedClasses);
   });
   
   // Fecha o popup
   handleCloseReschedule();
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
       <main className="flex-1 flex items-center justify-center py-4 px-3 sm:px-4 lg:px-6 pt-20 sm:pt-6 lg:py-8 pb-6 sm:pb-8">
         {/* Container principal responsivo */}
         <div className={`relative bg-white rounded-lg shadow-lg flex flex-col ${isMobile ? 'w-full mx-4 my-2' : 'w-full max-w-[95vw] h-[85vh] sm:h-[780px]'}`}>

           {/* Cabeçalho */}
           <div className={`flex justify-center ${isMobile ? 'px-4 pt-4' : 'px-8 pt-6'}`}>
             <h2 className={`font-semibold text-black ${isMobile ? 'text-2xl' : 'text-[34px]'}`}>
               Aulas do Mês
             </h2>
           </div>

           {/* Área de conteúdo do carrossel */}
           <div className={`flex flex-col flex-grow ${isMobile ? 'p-2' : 'px-6 py-4 lg:px-10 lg:py-6'}`}>

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
                     className="flex-shrink-0 w-full"
                     style={{ width: `${100 / pagesCount}%`, padding: isMobile ? '4px' : '8px' }}
                   >
                     {/* Grid responsivo */}
                     <div className={`w-full h-full flex items-start justify-center`}>
                       <div className={`
                         ${isMobile
                           ? 'flex flex-col gap-4 w-full'
                           : `grid w-full h-full gap-4 lg:gap-6 ${
                               window.innerWidth < 1024 
                                 ? 'grid-cols-2' 
                                 : window.innerWidth < 1440
                                   ? 'grid-cols-3'
                                   : 'grid-cols-4'
                             }`
                         }
                       `}>
                         {/* Mapeia e renderiza cada card de aula */}
                         {pageClasses.map((c) => (
                           <article
                             key={`${pageIndex}-${c.id}`}
                             className={`
                               bg-[#FEFEFE] border border-black rounded-lg shadow-md p-4 box-border
                               flex flex-col justify-between items-center text-center
                               ${isMobile ? 'w-full' : 'w-full min-w-0'}
                             `}
                             style={{
                               height: isMobile ? '210px' : '240px',
                               margin: isMobile ? '0 auto' : '0'
                             }}
                           >
                             {/* Div para agrupar o conteúdo superior */}
                             <div className="w-full">
                               {/* Título - MOBILE ORIGINAL */}
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
                               {/* Data - MOBILE ORIGINAL */}
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
                               {/* Professor - MOBILE ORIGINAL */}
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
                               {/* Estúdio - MOBILE ORIGINAL */}
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

                             {/* Botão Reagendar - MOBILE ORIGINAL */}
                             <button
                               onClick={() => handleOpenReschedule(c)}
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
                 <div className="flex gap-4 items-center">
                   <button
                     onClick={() => goToPage(currentPage - 1)}
                     disabled={currentPage === 0}
                     className={`w-8 h-8 border rounded-md flex items-center justify-center font-medium ${
                       currentPage === 0
                         ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                         : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50'
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
                         className={`w-[27px] h-[30px] border rounded-md flex items-center justify-center font-medium ${
                           active
                             ? 'bg-[#67AF97] border-[#67AF97] text-white'
                             : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50'
                         }`}
                         aria-current={active ? 'page' : undefined}
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
                         : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50'
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

     {/* Popup de Reagendamento */}
     <ReschedulePopup
       isOpen={reschedulePopup.isOpen}
       onClose={handleCloseReschedule}
       classData={reschedulePopup.classData}
       onConfirm={handleConfirmReschedule}
     />
   </div>
 );
}