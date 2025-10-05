import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, ArrowLeft } from "lucide-react";

// Mock inicial
const mockFotos = [
    { id: 1, nome: "Chegada", data: "2023-01-15", descricao: "Primeira aula", ano: 2023, url: "https://via.placeholder.com/300" },
    { id: 2, nome: "Agora", data: "2024-05-10", descricao: "Progresso atual", ano: 2024, url: "https://via.placeholder.com/300" },
    { id: 3, nome: "Progresso", data: "2024-08-20", descricao: "Resultado final", ano: 2024, url: "https://via.placeholder.com/300" },
];

export default function FotosPage() {
    const [fotos, setFotos] = useState([]);
    const [todasFotos, setTodasFotos] = useState([]);
    const [anoFiltro, setAnoFiltro] = useState("");
    const [isInstrutor, setIsInstrutor] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [novaFoto, setNovaFoto] = useState(null);
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [modalVisualizar, setModalVisualizar] = useState({ aberto: false, foto: null });

    const setMockUserType = () => true;

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario")) || { id: 1, tipo: "aluno" };
        usuario.tipo = setMockUserType() ? "instrutor" : "aluno";
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setIsInstrutor(usuario.tipo === "instrutor");

        fetchFotos();
    }, []);

    const fetchFotos = async () => {
        try {
            const dados = mockFotos;
            setTodasFotos(dados);
            setFotos(dados);
        } catch (error) {
            console.error("Erro ao buscar fotos:", error);
            setFotos([]);
        }
    };

    const uploadFotoAPI = async (file, nome, data, descricao) => {
        try {
            return {
                id: todasFotos.length + 1,
                nome,
                data,
                descricao,
                ano: new Date(data).getFullYear(),
                url: URL.createObjectURL(file)
            };
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            return null;
        }
    };

    const handleFiltroAno = (e) => {
        const ano = e.target.value;
        setAnoFiltro(ano);

        if (!ano) {
            setFotos(todasFotos);
        } else {
            setFotos(todasFotos.filter(f => f.ano.toString() === ano));
        }
    };

    const handleUploadFoto = async () => {
        if (!novaFoto || !nome || !data || !descricao) {
            alert("Preencha todos os campos: nome, data, descrição e selecione uma foto.");
            return;
        }

        const nova = await uploadFotoAPI(novaFoto, nome, data, descricao);
        if (nova) {
            const novasFotos = [nova, ...todasFotos];
            setTodasFotos(novasFotos);

            if (anoFiltro) {
                setFotos(novasFotos.filter(f => f.ano.toString() === anoFiltro));
            } else {
                setFotos(novasFotos);
            }

            setOpenModal(false);
            setNovaFoto(null);
            setNome("");
            setData("");
            setDescricao("");
        } else {
            alert("Falha ao enviar a foto");
        }
    };

    const handleExcluirFoto = (id) => {
        const novasFotos = todasFotos.filter(f => f.id !== id);
        setTodasFotos(novasFotos);

        if (anoFiltro) {
            setFotos(novasFotos.filter(f => f.ano.toString() === anoFiltro));
        } else {
            setFotos(novasFotos);
        }
    };

    const anosDisponiveis = [...new Set([...mockFotos, ...todasFotos].map(f => f.ano))];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

            {/* Botão Voltar */}
            <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 mb-4 text-teal-500 hover:text-teal-700"
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Fotos do Aluno</h1>

            {/* Filtro e botão adicionar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <label className="font-medium">Filtrar por ano:</label>
                    <select
                        value={anoFiltro}
                        onChange={handleFiltroAno}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">Todos</option>
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>

                {isInstrutor && (
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded shadow hover:bg-teal-600 transition"
                        onClick={() => setOpenModal(true)}
                    >
                        <Plus size={18} /> Adicionar Foto
                    </button>
                )}
            </div>

            {/* Galeria de fotos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fotos.length ? fotos.map(foto => (
                    <div key={foto.id} className="bg-white rounded shadow overflow-hidden relative">
                        
                        {/* Tornando imagem clicável e acessível */}
                        <button
                            onClick={() => setModalVisualizar({ aberto: true, foto })}
                            className="w-full p-0 m-0 border-none bg-transparent cursor-pointer"
                            aria-label={`Visualizar foto ${foto.nome}`}
                        >
                            <img
                                src={foto.url}
                                alt={foto.descricao}
                                className="w-full h-48 object-cover"
                            />
                        </button>

                        <div className="p-3">
                            <h3 className="font-medium text-gray-700">{foto.nome}</h3>
                            <p className="text-sm text-gray-500">{foto.data}</p>
                            <p className="text-sm text-gray-500">{foto.descricao}</p>
                        </div>

                        {isInstrutor && (
                            <button
                                className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
                                onClick={() => handleExcluirFoto(foto.id)}
                                title="Excluir Foto"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                )) : (
                    <p className="text-gray-500 col-span-full text-center">Nenhuma foto encontrada.</p>
                )}
            </div>

            {/* Modal Adicionar Foto */}
            {openModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh] relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setOpenModal(false)}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Adicionar Foto</h2>

                        <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNovaFoto(e.target.files[0])}
                                className="border rounded px-2 py-1"
                            />
                            {novaFoto && (
                                <img
                                    src={URL.createObjectURL(novaFoto)}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded"
                                />
                            )}
                            <input
                                type="text"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <input
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <button
                                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
                                onClick={handleUploadFoto}
                            >
                                Enviar Foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Visualizar Foto */}
            {modalVisualizar.aberto && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl w-full">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setModalVisualizar({ aberto: false, foto: null })}
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={modalVisualizar.foto.url}
                            alt={modalVisualizar.foto.descricao}
                            className="w-full h-auto rounded"
                        />
                        <div className="mt-4">
                            <h3 className="font-medium text-lg">{modalVisualizar.foto.nome}</h3>
                            <p className="text-sm text-gray-500">{modalVisualizar.foto.data}</p>
                            <p className="text-sm">{modalVisualizar.foto.descricao}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
