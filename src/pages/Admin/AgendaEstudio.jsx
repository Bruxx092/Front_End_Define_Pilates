import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown } from 'lucide-react';

// Dados de exemplo das aulas
const sampleClasses = [
    { id: 1, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 2, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 3, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 4, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 5, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 6, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 7, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
    { id: 8, title: 'Pilates para Iniciante', date: '02/09', teacher: 'Prof. Ana Souza', studio: 'Estudio Ghibli' },
];

// Dias que devem ser destacados (como na sua imagem de design)
const blueDays = new Set([2, 3, 4, 8, 9, 10, 23, 24, 25]);
// Cores do design
const darkBlueBg = 'bg-[#3A4A9B]';  // Fundo do dia específico
const whiteText = 'text-white';
const blackText = 'text-black';

// Componente para o Calendário (Refatorado)
const CalendarGrid = ({ 
    month, 
    year, 
    selectedDay, 
    onDaySelect, 
    onMonthChange, // -> 1. RECEBA A PROP
    onYearChange  // -> 1. RECEBA A PROP
}) => {
    const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay(); // 0 = Sunday

    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    // Criar um array com todos os dias (incluindo nulos para preenchimento)
    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        daysArray.push(i);
    }

    // Agrupar dias em semanas (linhas)
    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) {
        weeks.push(daysArray.slice(i, i + 7));
    }

    return (
        <div className="w-full">
             <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
                <div className="relative inline-block w-36 sm:w-40">
                    <select 
                        value={month} 
                        onChange={onMonthChange} // -> 2. USE A PROP AQUI
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
                        onChange={onYearChange} // -> 2. USE A PROP AQUI
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]"
                    >
                         {Array.from({ length: 5 }, (_, i) => 2023 + i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                </div>
            </div>

            {/* Grid principal do calendário */}
            <div className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden text-lg">
                {/* Cabeçalho dos dias da semana */}
                {weekdays.map(day => (
                    <div key={day} className="py-3 bg-gray-50 border-b border-r border-gray-300 last:border-r-0 text-center font-semibold text-gray-700">
                        {day}
                    </div>
                ))}

                {/* Renderiza as semanas (linhas) */}
                {weeks.map((week, weekIndex) => {
                    // Renderiza os dias da semana
                    return week.map((day, dayIndex) => {
                        const isBlueDay = blueDays.has(day);
                        
                        const dayBg = isBlueDay ? darkBlueBg : 'bg-white';
                        const textColor = isBlueDay ? whiteText : blackText;

                        const isLastCol = dayIndex === 6;
                        const isLastRow = weekIndex === weeks.length - 1;

                        return (
                            <div 
                                key={`${weekIndex}-${dayIndex}`} 
                                className={`
                                    p-2 text-center font-semibold cursor-pointer h-16 sm:h-20
                                    flex items-center justify-center text-2xl
                                    ${dayBg} ${textColor}
                                    ${!isLastCol ? 'border-r' : ''}
                                    ${!isLastRow ? 'border-b' : ''}
                                    border-gray-300
                                    ${day === null ? 'text-transparent' : ''}
                                `}
                                onClick={() => day !== null && onDaySelect(day)}
                            >
                                {day}
                            </div>
                        );
                    });
                })}
            </div>
        </div>
    );
};

// Componente para um card de aula individual
const ClassCard = ({ title, date, teacher, studio }) => {
    return (
        <article className="bg-[#FEFEFE] border border-black rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-48 sm:h-52">
            <div>
                <h3 className="font-medium text-gray-900 leading-tight text-xl sm:text-2xl mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="font-medium text-lg sm:text-xl text-[#67AF97] mb-1">
                    Data: {date}
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
    const [currentMonth, setCurrentMonth] = useState(8); // Setembro (0-indexed)
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(null); 

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        console.log(`Dia selecionado: ${day}/${currentMonth + 1}/${currentYear}`);
    };

    // -> 3. CRIE AS FUNÇÕES HANDLER
    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value)); 
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            {/* Componente da Sidebar */}
            <SidebarUnificada
                menuItems={sidebarConfigs.administrador.menuItems}
                userInfo={sidebarConfigs.administrador.userInfo}
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
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
                    {/* Container do calendário e dos cards */}
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">

                        {/* Cabeçalho */}
                        <div className="mb-6 text-center">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                                Calendário de Aulas
                            </h2>
                        </div>

                        {/* Calendário */}
                        <div className="mb-8">
                            <CalendarGrid 
                                month={currentMonth} 
                                year={currentYear} 
                                selectedDay={selectedDay}
                                onDaySelect={handleDaySelect}
                                onMonthChange={handleMonthChange} // -> 4. PASSE AS PROPS
                                onYearChange={handleYearChange} // -> 4. PASSE AS PROPS
                            />
                        </div>

                        {/* Grid de Aulas Responsivo */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {classes.map((c) => (
                                    <ClassCard
                                        key={c.id}
                                        title={c.title}
                                        date={c.date}
                                        teacher={c.teacher}
                                        studio={c.studio}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}