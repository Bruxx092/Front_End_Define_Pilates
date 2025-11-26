import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown } from 'lucide-react';

// Cores do design
const darkBlueBg = 'bg-[#3A4A9B]';
const whiteText = 'text-white';
const blackText = 'text-black';

const BASE_URL = 'http://localhost:8000';

// --- FUNÇÃO FETCH SEGURA PARA ALUNO ---
async function safeFetchAluno(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // Se der erro de permissão, apenas retorna null sem redirecionar
        if (response.status === 401 || response.status === 403) {
            console.warn(`[SafeFetchAluno] Acesso não autorizado em ${endpoint} (${response.status})`);
            return null; 
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na requisição segura do aluno:", error);
        return null;
    }
}

// --- COMPONENTES DO CALENDÁRIO ---
const CalendarGrid = ({ month, year, selectedDay, onDaySelect, onMonthChange, onYearChange, daysWithClasses }) => {
    const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= totalDays; i++) daysArray.push(i);

    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) weeks.push(daysArray.slice(i, i + 7));

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
                <div className="flex gap-2">
                    <div className="relative inline-block w-36 sm:w-40">
                        <select value={month} onChange={onMonthChange} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]">
                            {monthNames.map((name, index) => <option key={index} value={index}>{name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                    </div>
                    <div className="relative inline-block w-28 sm:w-32">
                        <select value={year} onChange={onYearChange} className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-lg font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97]">
                            {Array.from({ length: 5 }, (_, i) => 2024 + i).map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 border border-gray-300 rounded-lg overflow-hidden text-lg">
                {weekdays.map(day => (
                    <div key={day} className="py-3 bg-gray-50 border-b border-r border-gray-300 last:border-r-0 text-center font-semibold text-gray-700 text-sm sm:text-base">{day}</div>
                ))}
                {weeks.map((week, weekIndex) => (
                    week.map((day, dayIndex) => {
                        const hasClass = daysWithClasses.has(day);
                        const isSelected = day === selectedDay;
                        const dayBg = isSelected ? darkBlueBg : hasClass ? 'bg-blue-100' : 'bg-white';
                        const textColor = isSelected ? whiteText : blackText;
                        const isLastCol = dayIndex === 6;
                        const isLastRow = weekIndex === weeks.length - 1;

                        return (
                            <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`p-2 text-center font-semibold cursor-pointer h-16 sm:h-20 flex items-center justify-center text-lg sm:text-xl ${dayBg} ${textColor} ${!isLastCol ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''} border-gray-300 ${day === null ? 'text-transparent' : ''} transition-colors duration-200`}
                                onClick={() => day !== null && onDaySelect(day)}
                            >
                                {day}
                                {hasClass && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};

const ClassCard = ({ modality, date, time, studio, instructorName }) => {
    return (
        <article className="bg-[#FEFEFE] border border-gray-200 rounded-lg shadow-sm p-4 text-center flex flex-col justify-between h-auto min-h-[160px]">
            <div>
                <h3 className="font-semibold text-gray-900 leading-tight text-xl sm:text-2xl mb-1">
                    {modality}
                </h3>
                {instructorName && <p className="text-sm text-gray-500 mb-2">Com {instructorName}</p>}
                
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

// --- COMPONENTE PRINCIPAL ALUNO ---
export default function MinhasAulas() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    
    const [classes, setClasses] = useState([]); 
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        filterClasses();
    }, [classes, selectedDay, currentMonth, currentYear]);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const data = await safeFetchAluno('/aulas/');
            
            if (data) {
                // Filtrar apenas aulas do aluno logado
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const alunoId = userData.id_user;
                
                const formattedClasses = data
                    .filter(cls => {
                        // Verificar se o aluno está matriculado nesta aula
                        const alunosMatriculados = cls.estudantes || [];
                        return alunosMatriculados.some(aluno => 
                            (aluno.id_user === alunoId) || (aluno.id === alunoId)
                        );
                    })
                    .map(cls => {
                        const dateParts = cls.data_aula.split('-');
                        const formattedDate = `${dateParts[2]}/${dateParts[1]}`;
                        
                        return {
                            id: cls.id,
                            modality: cls.modalidade || 'Aula',
                            date: formattedDate,
                            fullDate: cls.data_aula, 
                            time: cls.horario_aula, 
                            studio: 'Estúdio Ghibli', 
                            instructorName: cls.instrutor ? cls.instrutor.nome : null 
                        };
                    });
                
                setClasses(formattedClasses);
            }
        } catch (error) {
            console.error("Erro ao buscar aulas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterClasses = () => {
        let filtered = classes.filter(c => {
            const classDate = new Date(c.fullDate + 'T00:00:00'); 
            return classDate.getMonth() === currentMonth && classDate.getFullYear() === currentYear;
        });

        if (selectedDay) {
            const dayString = selectedDay.toString().padStart(2, '0');
            filtered = filtered.filter(c => c.date.startsWith(dayString));
        }
        
        setFilteredClasses(filtered);
    };

    const getDaysWithClasses = (classList) => {
        const days = new Set();
        classList.forEach(cls => {
            const classDate = new Date(cls.fullDate + 'T00:00:00');
            if (classDate.getMonth() === currentMonth && classDate.getFullYear() === currentYear) {
                days.add(classDate.getDate());
            }
        });
        return days;
    };

    const daysWithClasses = getDaysWithClasses(classes);

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada
                menuItems={sidebarConfigs.aluno.menuItems}
                userInfo={sidebarConfigs.aluno.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div className="flex flex-col flex-1 transition-all duration-300 min-w-0" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
                    <div className="bg-white rounded-lg shadow-lg flex flex-col p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-7xl mx-auto">
                        
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center sm:text-left">
                                <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">Minhas Aulas</h2>
                                <p className="text-gray-600 mt-2">Acompanhe sua agenda de aulas</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">Carregando suas aulas...</div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <CalendarGrid 
                                        month={currentMonth} 
                                        year={currentYear} 
                                        selectedDay={selectedDay}
                                        onDaySelect={setSelectedDay}
                                        onMonthChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                                        onYearChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                        daysWithClasses={daysWithClasses}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 text-xl sm:text-2xl mb-4">
                                        {selectedDay ? `Aulas do dia ${selectedDay}` : 'Todas as Aulas do Mês'}
                                    </h3>
                                    
                                    {filteredClasses.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {selectedDay 
                                                ? `Nenhuma aula encontrada para o dia ${selectedDay}`
                                                : 'Nenhuma aula encontrada para este mês'
                                            }
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            {filteredClasses.map((item) => (
                                                <ClassCard
                                                    key={item.id}
                                                    modality={item.modality}
                                                    date={item.date}
                                                    time={item.time}
                                                    studio={item.studio}
                                                    instructorName={item.instructorName}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}