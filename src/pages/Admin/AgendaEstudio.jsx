import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown } from 'lucide-react';

const sampleClasses = [
    // Aulas em Setembro 2025
    { id: 1, title: 'Pilates para Iniciante', date: '2025-09-02', teacher: 'Prof. Ana Souza', studio: 'Estudio Itaquera' },
    { id: 2, title: 'Fisioterapia', date: '2025-09-03', teacher: 'Prof. Carlos Silva', studio: 'Estudio São Miguel' },
    { id: 3, title: 'Pilates Funcional', date: '2025-09-04', teacher: 'Prof. Mariana Costa', studio: 'Estudio Itaquera' },
    
    // Aulas em Outubro 2025
    { id: 4, title: 'Pilates Intermediário', date: '2025-10-05', teacher: 'Prof. Ana Souza', studio: 'Estudio Itaquera' },
    { id: 5, title: 'Yoga para Iniciantes', date: '2025-10-06', teacher: 'Prof. João Medeiros', studio: 'Estudio Sção Miguel' },
    
    // Aulas em Setembro 2024 (outro ano)
    { id: 6, title: 'Pilates Avançado', date: '2024-09-07', teacher: 'Prof. Ricardo Lima', studio: 'Estudio Itaquera' },
    { id: 7, title: 'Yoga para Iniciantes', date: '2024-09-08', teacher: 'Prof. Carla Santos', studio: 'Estudio São Miguel' },
    { id: 8, title: 'Pilates Funcional', date: '2025-09-09', teacher: 'Prof. Ana Souza', studio: 'Estudio Itaquera' },
];


const MonthYearSelector = ({ 
    month, 
    year, 
    onMonthChange,
    onYearChange 
}) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
            <div className="relative inline-block w-36 sm:w-40">
                <select 
                    value={month} 
                    onChange={onMonthChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]"
                >
                    {monthNames.map((name, index) => (
                        <option key={index} value={index}>{name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
            <div className="relative inline-block w-28 sm:w-32">
                <select 
                    value={year} 
                    onChange={onYearChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]"
                >
                    
                    {Array.from({ length: 3 }, (_, i) => 2023 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
        </div>
    );
};

const ClassCard = ({ title, date, teacher, studio }) => {
    
    // Helper para formatar a data de YYYY-MM-DD para DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <article className="bg-[#FEFEFE] border border-black rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-48 sm:h-52">
            <div>
                <h3 className="font-medium text-gray-900 leading-tight text-xl sm:text-2xl mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="font-medium text-lg sm:text-xl text-[#67AF97] mb-1">
                    
                    Data: {formatDate(date)}
                </p>
                <p className="font-medium text-black text-base sm:text-lg line-clamp-1">
                    {teacher}
                </p>
                <p className="font-medium text-black text-base sm:text-lg line-clamp-1">
                    {studio}
                </p>
            </div>
        </article>
    );
};

// Componente principal da página
export default function AgendaEstudio({ classes = sampleClasses }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    const [currentMonth, setCurrentMonth] = useState(8);
    const [currentYear, setCurrentYear] = useState(2025);

    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value)); 
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value));
    };


    const filteredClasses = classes.filter(classe => {
        if (!classe.date) return false;
        const classDate = new Date(classe.date + 'T00:00:00');
        const classMonth = classDate.getMonth(); // 0-11
        const classYear = classDate.getFullYear();
        
        return classMonth === currentMonth && classYear === currentYear;
    });

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            {/* Componente da Sidebar */}
            <SidebarUnificada
                menuItems={sidebarConfigs.administrador.menuItems}
                userInfo={sidebarConfigs.administrador.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div
                className="flex flex-col flex-1 transition-all duration-300 min-w-0"
                style={{
                    marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
                    width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
                }}
            >
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">

                        {/* Cabeçalho */}
                        <div className="mb-6 text-center">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                                Calendário de Aulas
                            </h2>
                        </div>

                        {/* Seletores de Mês/Ano */}
                        <div className="mb-8">
                            <MonthYearSelector 
                                month={currentMonth} 
                                year={currentYear} 
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                            />
                        </div>

                        {/* Grid de Aulas Responsivo */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {filteredClasses.length > 0 ? (
                                    // Mapeia as AULAS FILTRADAS
                                    filteredClasses.map((c) => (
                                        <ClassCard
                                            key={c.id}
                                            title={c.title}
                                            date={c.date}
                                            teacher={c.teacher}
                                            studio={c.studio}
                                        />
                                    ))
                                ) : (
                                    // Mensagem para quando não há aulas
                                    <p className="col-span-full text-center text-gray-500 text-lg">
                                        Nenhuma aula encontrada para este mês e ano.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}