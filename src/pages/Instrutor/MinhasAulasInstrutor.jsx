import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react';
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, Calendar, AlertCircle } from 'lucide-react';
import api from '../../services/api';

// --- COMPONENTES UI ---

const MonthYearSelector = ({ month, year, onMonthChange, onYearChange }) => {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
                <Calendar className="text-[#67AF97]" size={20} />
                <span className="font-medium text-gray-700">Filtrar por:</span>
            </div>
            <div className="relative inline-block w-40">
                <select 
                    value={month} 
                    onChange={(e) => onMonthChange(parseInt(e.target.value))} 
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-base font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97] text-gray-700 cursor-pointer"
                >
                    {monthNames.map((name, index) => (
                        <option key={index} value={index}>{name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
            <div className="relative inline-block w-32">
                <select 
                    value={year} 
                    onChange={(e) => onYearChange(parseInt(e.target.value))} 
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-base font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#67AF97] text-gray-700 cursor-pointer"
                >
                    {Array.from({ length: 5 }, (_, i) => 2024 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
        </div>
    );
};

const ClassCard = ({ id, modality, date, time, studio, numAlunos }) => {
    return (
        <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#67AF97]"></div>
            
            <div className="flex flex-col items-center flex-grow justify-center">
                <h3 className="font-bold text-gray-800 text-xl mb-1 text-center line-clamp-2">
                    {modality}
                </h3>
                
                <p className="text-sm text-gray-500 mb-3">
                    {numAlunos > 0 ? `${numAlunos} Aluno(s)` : 'Sem alunos matriculados'}
                </p>
                
                <div className="flex gap-6 text-center mb-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Data</span>
                        <span className="text-lg font-medium text-[#67AF97]">{date}</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Horário</span>
                        <span className="text-lg font-medium text-gray-800">{time}</span>
                    </div>
                </div>
                 <p className="font-medium text-black text-sm sm:text-base mt-2 text-center">
                    {studio}
                </p>
            </div>
        </article>
    );
};

// --- PÁGINA PRINCIPAL ---

export default function MinhasAulasInstrutor() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();
    
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const [classes, setClasses] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(null);

    // Busca aulas ao carregar ou mudar filtro
    useEffect(() => {
        fetchMyClasses();
    }, [currentMonth, currentYear]);

    const fetchMyClasses = async () => {
        setIsLoading(true);
        setErrorState(null);
        try {
            // Calcula o período do mês selecionado
            const startDate = new Date(currentYear, currentMonth, 1);
            const endDate = new Date(currentYear, currentMonth + 1, 0);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            // O backend já filtra as aulas pelo usuário logado (token)
            const response = await api.get('/agenda/minhas_aulas', {
                params: { 
                    start_date: startStr,
                    end_date: endStr
                }
            });
            
            const data = response.data;
            
            if (data && Array.isArray(data)) {
                const formattedClasses = data.map((cls, index) => {
                    const rawDate = cls.dataAgendaAula || cls.data_aula;
                    const dateObj = new Date(rawDate);
                    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
                    
                    const day = isValidDate ? String(dateObj.getDate()).padStart(2, '0') : '--';
                    const month = isValidDate ? String(dateObj.getMonth() + 1).padStart(2, '0') : '--';
                    const formattedDate = `${day}/${month}`;
                    
                    const hours = isValidDate ? String(dateObj.getHours()).padStart(2, '0') : '--';
                    const minutes = isValidDate ? String(dateObj.getMinutes()).padStart(2, '0') : '--';
                    const timeStr = `${hours}:${minutes}`;

                    // Tenta resolver o nome do estúdio com fallback
                    const studioName = cls.EstudioID === 1 ? 'Estúdio Itaquera' : (cls.EstudioID === 2 ? 'Estúdio São Miguel' : 'Estúdio Pilates');

                    return {
                        id: cls.AulaID || cls._id || index,
                        modality: cls.disciplina || cls.tituloAulaCompleto || cls.titulo_aula || 'Aula',
                        date: formattedDate,
                        time: timeStr,
                        studio: studioName,
                        numAlunos: cls.participantes ? cls.participantes.length : 0,
                        fullDate: isValidDate ? dateObj : new Date()
                    };
                });
                
                // Ordenar por data
                formattedClasses.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
                
                setClasses(formattedClasses);
            } else {
                setClasses([]);
            }
        } catch (error) {
            console.error("Erro ao buscar aulas do instrutor:", error);
            setErrorState("Erro ao carregar agenda. Tente novamente.");
            setClasses([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <SidebarUnificada
                menuItems={sidebarConfigs.instrutor.menuItems}
                userInfo={sidebarConfigs.instrutor.userInfo}
                isOpen={menuOpen}
                onOpenChange={setMenuOpen}
            />

            <div className="flex flex-col flex-1 transition-all duration-300 min-w-0" style={{ marginLeft: !isMobile ? `${sidebarWidth}px` : "0", width: !isMobile ? `calc(100% - ${sidebarWidth}px)` : "100%" }}>
                <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6">
                    <div className="w-full max-w-7xl mx-auto">
                        
                        <div className="mb-8 border-b pb-4">
                            <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">Minhas Aulas</h2>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Confira sua agenda de aulas atribuídas</p>
                        </div>

                        <MonthYearSelector 
                            month={currentMonth} 
                            year={currentYear} 
                            onMonthChange={setCurrentMonth} 
                            onYearChange={setCurrentYear} 
                        />

                        {isLoading ? (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#67AF97] mx-auto mb-3"></div>
                                <p className="text-gray-500">Carregando sua agenda...</p>
                            </div>
                        ) : errorState ? (
                             <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center text-red-600">
                                <AlertCircle size={48} className="mb-2" />
                                <p>{errorState}</p>
                            </div>
                        ) : (
                            <>
                                {classes.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                                        <Calendar className="text-gray-300 mb-3" size={48} />
                                        <p className="text-gray-500 font-medium">Nenhuma aula encontrada para este mês.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                        {classes.map((item) => (
                                            <ClassCard
                                                key={item.id}
                                                id={item.id}
                                                modality={item.modality}
                                                date={item.date}
                                                time={item.time}
                                                studio={item.studio}
                                                numAlunos={item.numAlunos}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}