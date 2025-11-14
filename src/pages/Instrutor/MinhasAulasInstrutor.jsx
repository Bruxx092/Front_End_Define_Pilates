import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown } from 'lucide-react';

// Dados de exemplo das aulas
const sampleClasses = [
    { id: 1, modality: 'Pilates', date: '02/09', time: '08:00', studio: 'Estudio Ghibli' },
    { id: 2, modality: 'Yoga', date: '02/09', time: '10:00', studio: 'Estudio Central' },
    { id: 3, modality: 'Curso', date: '02/09', time: '14:00', studio: 'Estudio Norte' },
    { id: 4, modality: 'Pilates', date: '03/09', time: '09:00', studio: 'Estudio Ghibli' },
    { id: 5, modality: 'Yoga', date: '03/09', time: '11:00', studio: 'Estudio Central' },
    { id: 6, modality: 'Curso', date: '04/09', time: '15:00', studio: 'Estudio Norte' },
    { id: 7, modality: 'Pilates', date: '04/09', time: '16:00', studio: 'Estudio Ghibli' },
    { id: 8, modality: 'Yoga', date: '05/09', time: '08:30', studio: 'Estudio Central' },
];

// Dias que devem ser destacados (dias que têm aulas)
const getDaysWithClasses = (classes) => {
    const days = new Set();
    classes.forEach(classItem => {
        const day = parseInt(classItem.date.split('/')[0]);
        days.add(day);
    });
    return days;
};

// Cores do design
const darkBlueBg = 'bg-[#3A4A9B]';
const whiteText = 'text-white';
const blackText = 'text-black';

// Componente para o Calendário
const CalendarGrid = ({ 
    month, 
    year, 
    selectedDay, 
    onDaySelect, 
    onMonthChange,
    onYearChange,
    daysWithClasses
}) => {
    const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        daysArray.push(i);
    }

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
                        {Array.from({ length: 5 }, (_, i) => 2023 + i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden text-lg">
                {weekdays.map(day => (
                    <div key={day} className="py-3 bg-gray-50 border-b border-r border-gray-300 last:border-r-0 text-center font-semibold text-gray-700 text-sm sm:text-base">
                        {day}
                    </div>
                ))}

                {weeks.map((week, weekIndex) => {
                    return week.map((day, dayIndex) => {
                        const hasClass = daysWithClasses.has(day);
                        const isSelected = day === selectedDay;
                        
                        const dayBg = isSelected ? darkBlueBg : hasClass ? 'bg-blue-100' : 'bg-white';
                        const textColor = isSelected ? whiteText : blackText;

                        const isLastCol = dayIndex === 6;
                        const isLastRow = weekIndex === weeks.length - 1;

                        return (
                            <div 
                                key={`${weekIndex}-${dayIndex}`} 
                                className={`
                                    p-2 text-center font-semibold cursor-pointer h-16 sm:h-20
                                    flex items-center justify-center text-lg sm:text-xl
                                    ${dayBg} ${textColor}
                                    ${!isLastCol ? 'border-r' : ''}
                                    ${!isLastRow ? 'border-b' : ''}
                                    border-gray-300
                                    ${day === null ? 'text-transparent' : ''}
                                    transition-colors duration-200
                                `}
                                onClick={() => day !== null && onDaySelect(day)}
                            >
                                {day}
                                {hasClass && !isSelected && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                                )}
                            </div>
                        );
                    });
                })}
            </div>
        </div>
    );
};

// Componente para um card de aula individual
const ClassCard = ({ modality, date, time, studio }) => {
    return (
        <article className="bg-[#FEFEFE] border border-gray-200 rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-40 sm:h-44">
            <div>
                <h3 className="font-semibold text-gray-900 leading-tight text-xl sm:text-2xl mb-3">
                    {modality}
                </h3>
                <p className="font-medium text-lg sm:text-xl text-[#67AF97] mb-2">
                    {date} - {time}
                </p>
                <p className="font-medium text-black text-base sm:text-lg">
                    {studio}
                </p>
            </div>
        </article>
    );
};

// Componente principal da página
export default function MinhasAulasInstrutor() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    const [currentMonth, setCurrentMonth] = useState(8); // Setembro (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024);
    const [selectedDay, setSelectedDay] = useState(null);
    const [filteredClasses, setFilteredClasses] = useState(sampleClasses);

    const daysWithClasses = getDaysWithClasses(sampleClasses);

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        
        // Filtrar aulas pelo dia selecionado
        if (day) {
            const dayString = day.toString().padStart(2, '0');
            const filtered = sampleClasses.filter(classItem => 
                classItem.date.startsWith(dayString)
            );
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses(sampleClasses);
        }
    };

    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value));
        setSelectedDay(null);
        setFilteredClasses(sampleClasses);
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value));
        setSelectedDay(null);
        setFilteredClasses(sampleClasses);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            {/* Componente da Sidebar do Instrutor */}
            <SidebarUnificada
                menuItems={sidebarConfigs.instrutor.menuItems}
                userInfo={sidebarConfigs.instrutor.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            {/* Container do conteúdo principal */}
            <div
                className="flex flex-col flex-1 transition-all duration-300 min-w-0"
                style={{
                    marginLeft: !isMobile ? `${sidebarWidth}px` : "0",
                    width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%",
                }}
            >
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
                    {/* Container do calendário e dos cards */}
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">

                        {/* Cabeçalho */}
                        <div className="mb-6 text-center">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                                Minhas Aulas
                            </h2>
                            {selectedDay && (
                                <p className="text-lg text-gray-600 mt-2">
                                    Aulas do dia {selectedDay.toString().padStart(2, '0')}/{String(currentMonth + 1).padStart(2, '0')}
                                </p>
                            )}
                        </div>

                        {/* Calendário */}
                        <div className="mb-8">
                            <CalendarGrid 
                                month={currentMonth} 
                                year={currentYear} 
                                selectedDay={selectedDay}
                                onDaySelect={handleDaySelect}
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                                daysWithClasses={daysWithClasses}
                            />
                        </div>

                        {/* Grid de Aulas Responsivo */}
                        <div>
                            <h3 className="font-semibold text-gray-900 text-xl sm:text-2xl mb-4">
                                {selectedDay ? 'Aulas do Dia' : 'Todas as Aulas'}
                            </h3>
                            
                            {filteredClasses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhuma aula encontrada para este dia
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {filteredClasses.map((classItem) => (
                                        <ClassCard
                                            key={classItem.id}
                                            modality={classItem.modality}
                                            date={classItem.date}
                                            time={classItem.time}
                                            studio={classItem.studio}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}