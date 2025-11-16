import SidebarUnificada from "@/components/layout/Sidebar/SidebarUnificada";
import { sidebarConfigs } from "@/components/layout/Sidebar/sidebarConfigs";
import React, { useState, useEffect } from 'react'; // --- MODIFICADO --- (Adicionado useEffect)
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDown, Building } from 'lucide-react';
import api from '../../services/api';

const STUDIO_MAP = {
    1: 'Estudio Itaquera',
    2: 'Estudio São Miguel',
    // Adicione outro se tiver
};

// Aqui vai o mapeamento dos IDs dos professores para nomes
const TEACHER_MAP = {
    "1": 'Prof. Ana Souza', // Exemplo de dado mockado
    "2": 'Prof. Carlos Silva',
    "3": 'Prof. Mariana Costa',
    // ...
};

const studios = [
    { id: 'Todos', name: 'Todos' },
    { id: 1, name: 'Estudio Itaquera' },
    { id: 2, name: 'Estudio São Miguel' }
];

const StudioSelector = ({ studios, selectedStudio, onSelectStudio }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center text-gray-700 font-semibold">
                <Building size={20} className="mr-2" />
                <span className="mr-3">Estúdio:</span>
            </div>
            {studios.map((studio) => (
                <button
                    key={studio.id}
                    onClick={() => onSelectStudio(studio.id)} 
                    className={`
                        py-2 px-5 rounded-full font-medium text-sm transition-all
                        ${selectedStudio === studio.id 
                            ? 'bg-[#67AF97] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                    `}
                >
                    {studio.name}
                </button>
            ))}
        </div>
    );
};

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
    

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
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


export default function AgendaEstudio() { 
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile, sidebarWidth } = useSidebar();

    const [allClasses, setAllClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [selectedStudio, setSelectedStudio] = useState('Todos');
    const [currentMonth, setCurrentMonth] = useState(8);
    const [currentYear, setCurrentYear] = useState(2025);


    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);


            const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
            const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${lastDay}`;
            
            try {
                const response = await api.get('/agenda/cronograma', {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });
                
                setAllClasses(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar agenda:", error);
                setAllClasses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, [currentMonth, currentYear]);

    
    const handleMonthChange = (e) => {
        setCurrentMonth(parseInt(e.target.value)); 
    };

    const handleYearChange = (e) => {
        setCurrentYear(parseInt(e.target.value));
    };

    const handleStudioChange = (studioId) => {
        setSelectedStudio(studioId);
    };

    const filteredAndMappedClasses = allClasses
        .filter(aula => {
            if (selectedStudio === 'Todos') return true;
            return aula.EstudioID == selectedStudio;
        })
        .map(aula => {
            return {
                id: aula.AulaID || aula._id,
                title: aula.disciplina,
                date: aula.dataAgendaAula,
                teacher: TEACHER_MAP[aula.professorResponsavel] || `(ID: ${aula.professorResponsavel})`,
                studio: STUDIO_MAP[aula.EstudioID] || "Estúdio Desconhecido"
            };
        });

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
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

                        <div className="mb-6 text-center">
                            <h2 className="font-semibold text-gray-900 text-2xl sm:text-3xl lg:text-4xl">
                                Agenda de Aulas
                            </h2>
                        </div>

                        <StudioSelector 
                            studios={studios}
                            selectedStudio={selectedStudio}
                            onSelectStudio={handleStudioChange}
                        />

                        <div className="mb-8">
                            <MonthYearSelector 
                                month={currentMonth} 
                                year={currentYear} 
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                            />
                        </div>
+
                        <div>
                            {isLoading ? (
                                <p className="col-span-full text-center text-gray-500 text-lg">Carregando aulas...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {filteredAndMappedClasses.length > 0 ? (
                                        filteredAndMappedClasses.map((c) => (
                                            <ClassCard
                                                key={c.id}
                                                title={c.title}
                                                date={c.date}
                                                teacher={c.teacher}
                                                studio={c.studio}
                                            />
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-gray-500 text-lg">
                                            Nenhuma aula encontrada para esta seleção.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}