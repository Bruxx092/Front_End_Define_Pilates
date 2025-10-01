import React, { useState, useRef, useEffect } from 'react';

const sampleClasses = [
  { id: 1, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 2, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 3, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 4, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 5, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 6, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 7, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
  { id: 8, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' }
];

export default function MonthlyClasses({ classes = sampleClasses }) {
  const pagesCount = 4; // número de páginas visíveis na paginação (1,2,3,4)
  const [currentPage, setCurrentPage] = useState(0); // índice da página atual (0-based)
  const [isAnimating, setIsAnimating] = useState(false); // flag para o estado da animação
  const trackRef = useRef(null);

  // Cada painel é uma "página" que contém os mesmos dados
  const pages = Array.from({ length: pagesCount }, () => classes);

  // Ao trocar de página, ativa animação e depois limpa flag
  const goToPage = (index) => {
    if (index === currentPage) return;
    setIsAnimating(true);
    setCurrentPage(index);
    // limpa o estado de animação após a transição
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
  }, [currentPage]);

  return (
    // Fundo que ocupa a tela inteira
    <div className="min-h-screen w-full bg-[#F6F9FF] flex items-center justify-center font-inter">
      {/* Painel branco centralizado */}
      <div
        className="relative bg-white rounded-sm"
        style={{ width: '1448px', height: '780px' }}
      >
        {/* Cabeçalho */}
        <div className="px-8 pt-6">
          <h2 className="text-[34px] font-semibold text-black">Aulas do Mês</h2>
        </div>

        {/* Área de conteúdo: container com overflow para o slide */}
        <div className="px-10 pt-6">
          {/* viewport: oculta o conteúdo que está fora do painel para criar o efeito de slide */}
          <div className="relative overflow-hidden" style={{ width: '100%', height: '600px' }}>
            {/* track: linha horizontal que contém N painéis (um painel por página) */}
            <div
              ref={trackRef}
              className="flex"
              // transform em porcentagem: cada painel ocupa 100% da largura do viewport
              style={{
                width: `${pagesCount * 100}%`,
                transform: `translateX(-${currentPage * (100 / pagesCount)}%)`,
                transition: isAnimating ? 'transform 420ms ease' : 'transform 420ms ease'
              }}
            >
              {/* renderiza cada painel */}
              {pages.map((pageClasses, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex-shrink-0"
                  style={{ width: `${100 / pagesCount}%`, paddingRight: '8px', paddingLeft: '8px' }}
                >
                  {/* Grid interno */}
                  <div className="w-full h-full flex items-start justify-center">
                    <div
                      className="grid grid-cols-4 gap-x-6 gap-y-6"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {pageClasses.map((c) => (
                        <article
                          key={`${pageIndex}-${c.id}`}
                          className="bg-[#FEFEFE] border border-black rounded-lg shadow-md p-4 box-border flex flex-col justify-center items-center text-center"
                          style={{ width: '324px', height: '159px', margin: '0 auto' }}
                        >
                          {/* Título */}
                          <h3
                            className="font-medium text-black mb-1 leading-tight"
                            style={{
                              fontSize: '28px',
                              lineHeight: '34px',
                              wordBreak: 'break-word',
                              overflow: 'hidden'
                            }}
                          >
                            {c.title}
                          </h3>

                          {/* Data */}
                          <p
                            className="font-medium"
                            style={{
                              fontSize: '28px',
                              lineHeight: '34px',
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
                              fontSize: '22px',
                              lineHeight: '26px',
                              color: '#000',
                              marginTop: '6px',
                              wordBreak: 'break-word',
                              overflow: 'hidden'
                            }}
                          >
                            {c.teacher}
                          </p>

                          {/* Estúdio */}
                          <p
                            className="font-medium"
                            style={{
                              fontSize: '22px',
                              lineHeight: '26px',
                              color: '#000',
                              marginTop: '2px',
                              wordBreak: 'break-word',
                              overflow: 'hidden'
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
          </div>

          {/* Paginação (rodapé) */}
          <div className="w-full flex justify-center mt-6">
            <div className="flex gap-4 items-center">
              {Array.from({ length: pagesCount }).map((_, idx) => {
                const active = idx === currentPage;
                return (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={`w-[27px] h-[30px] border rounded-md flex items-center justify-center font-medium ${
                      active ? 'bg-[#59A64F] border-[#59A64F] text-white' : 'bg-[#FEFEFE] border-black text-black'
                    }`}
                    aria-current={active ? 'true' : 'false'}
                    aria-label={`Página ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}