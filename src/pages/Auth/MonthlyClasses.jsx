import React, { useState, useRef, useEffect } from 'react';

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

export default function MonthlyClasses({ classes = sampleClasses }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef(null);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcula quantos itens cabem por página baseado no layout
  const getItemsPerPage = () => {
    if (isMobile) {
      return 4; // 2x2 grid no mobile
    }
    return 8; // 4x2 grid no desktop
  };

  // Divide as aulas em páginas dinamicamente
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

  const goToPage = (index) => {
    if (index === currentPage || index < 0 || index >= pagesCount) return;
    setIsAnimating(true);
    setCurrentPage(index);
    setTimeout(() => setIsAnimating(false), 450);
  };

  // Permite navegar com setas do teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goToPage(Math.min(currentPage + 1, pagesCount - 1));
      if (e.key === 'ArrowLeft') goToPage(Math.max(currentPage - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPage, pagesCount]);

  return (
    <div className="min-h-screen w-full bg-[#F6F9FF] flex items-center justify-center font-inter py-4">
      {/* Container principal com responsividade */}
      <div className={`relative bg-white rounded-sm ${isMobile ? 'w-full mx-4 my-2' : 'w-[1448px] h-[780px]'}`}>
        {/* Cabeçalho */}
        <div className={`${isMobile ? 'px-4 pt-4' : 'px-8 pt-6'}`}>
          <h2 className={`font-semibold text-black ${isMobile ? 'text-2xl' : 'text-[34px]'}`}>
            Aulas do Mês
          </h2>
        </div>

        {/* Área de conteúdo */}
        <div className={`${isMobile ? 'px-2 pt-4' : 'px-10 pt-6'}`}>
          {/* Viewport do slider */}
          <div 
            className="relative overflow-hidden" 
            style={{ 
              width: '100%', 
              height: isMobile ? 'auto' : '600px',
              minHeight: isMobile ? '400px' : '600px'
            }}
          >
            {/* Track do slider */}
            <div
              ref={trackRef}
              className="flex"
              style={{
                width: `${pagesCount * 100}%`,
                transform: `translateX(-${currentPage * (100 / pagesCount)}%)`,
                transition: isAnimating ? 'transform 420ms ease' : 'none'
              }}
            >
              {/* Renderiza cada página */}
              {pages.map((pageClasses, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex-shrink-0"
                  style={{ width: `${100 / pagesCount}%`, padding: isMobile ? '4px' : '8px' }}
                >
                  {/* Grid responsivo */}
                  <div className={`w-full h-full flex items-start justify-center`}>
                    <div className={`
                      ${isMobile 
                        ? 'grid grid-cols-2 gap-2 w-full' 
                        : 'grid grid-cols-4 gap-x-6 gap-y-6 w-full'
                      }
                    `}>
                      {pageClasses.map((c) => (
                        <article
                          key={`${pageIndex}-${c.id}`}
                          className={`
                            bg-[#FEFEFE] border border-black rounded-lg shadow-md p-4 box-border 
                            flex flex-col justify-center items-center text-center
                            ${isMobile ? 'w-full' : 'w-[324px]'}
                          `}
                          style={{ 
                            height: isMobile ? '140px' : '159px',
                            margin: '0 auto'
                          }}
                        >
                          {/* Título */}
                          <h3
                            className="font-medium text-black mb-1 leading-tight"
                            style={{
                              fontSize: isMobile ? '18px' : '28px',
                              lineHeight: isMobile ? '22px' : '34px',
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
                            className="font-medium"
                            style={{
                              fontSize: isMobile ? '18px' : '28px',
                              lineHeight: isMobile ? '22px' : '34px',
                              color: '#59A64F',
                              marginTop: '4px'
                            }}
                          >
                            {c.date}
                          </p>

                          {/* Professor */}
                          <p
                            className="font-medium"
                            style={{
                              fontSize: isMobile ? '14px' : '22px',
                              lineHeight: isMobile ? '16px' : '26px',
                              color: '#000',
                              marginTop: isMobile ? '2px' : '6px',
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
                            className="font-medium"
                            style={{
                              fontSize: isMobile ? '14px' : '22px',
                              lineHeight: isMobile ? '16px' : '26px',
                              color: '#000',
                              marginTop: isMobile ? '0px' : '2px',
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {c.studio}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* === PAGINAÇÃO MOVIDA PARA DENTRO DO VIEWPORT (para permitir posicionamento absoluto no mobile) === */}
            {/* Paginação: mantém desktop igual e mobile usa posição absoluta dentro do viewport */}
{pagesCount > 0 && (
  isMobile ? (
    // === MOBILE: paginação absoluta dentro do viewport ===
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{ bottom: 24, zIndex: 30 }} // <-- ajuste bottom para "subir" mais/menos
    >
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
                  ? 'bg-[#59A64F] border-[#59A64F] text-white' 
                  : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50'
              }`}
              aria-current={active ? 'true' : 'false'}
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
  ) : (
    // === DESKTOP: paginação estática abaixo do conteúdo (como antes) ===
    <div className="w-full flex justify-center mt-6">
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
                  ? 'bg-[#59A64F] border-[#59A64F] text-white' 
                  : 'bg-[#FEFEFE] border-black text-black hover:bg-gray-50'
              }`}
              aria-current={active ? 'true' : 'false'}
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
  )
)}
            {/* === FIM DA PAGINAÇÃO DENTRO DO VIEWPORT === */}
          </div>

          {/* Nota: em desktop a paginação já está renderizada dentro do viewport block acima,
              mas por causa da lógica de classes ela aparece visualmente abaixo do conteúdo. */}
        </div>
      </div>
    </div>
  );
}
