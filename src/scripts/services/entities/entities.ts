export class Categoria {
    id: number;
    criadoPorID: number;
    nome: string;
    cor: string;
}

export class Origem {
    id: number;
    nome: string;
}

export class Membro {    
    id: number;
    usuarioID: number;    
    convidadoId: number;
    nome: string;      
    valor?: number;  
}

export class Despesa {    
    despesaID: number;
    parcelaID: number;
    descricao: string;
    dataCompra: string;
    vencimento: string;
    origemID: number;
    origem: string;
    categoriaID: number;
    categoria: string;
    valor: number;
    totalParcelas: number;
    parcelaAtual: number;
    isPaga: boolean;
    isFixa: boolean;
    devedores: Membro[];
}

export class DespesaCriacao {    
    despesaID: number;
    parcelaID: number;
    descricao: string;
    criadoEm: string;
    vencimento: string;
    origemID: number;
    categoriaID: number;
    valor: number;
    totalParcelas: number;
    parcelaAtual: number;
    isPaga: boolean;
    isFixa: boolean;
    devedorId?: number;
    devedorConvId?: number;
    devedorUsId?: number;
    devedorNome?: string;
}

export class DespesaMes {
    despesaID: number;
    parcelaID: number;
    descricao: string;
    vencimento: string;
    valor: number;
    totalParcelas: number;
    parcelaAtual: number;
    status: string;
    categoria: string;
    categoriaCor: string;
    categoriaID: number;
    origemID: number;
    origem: string;
    dataCompra: string;
    devedores: DevedorModel[];
}

export class DevedorModel
{
    id: number;
    nome: string;
    valor: number;
    usuarioId?: number;
    convidadoId?: number;
}

export class DashboadDados {
    data: string;
    nome: string;
    urlFotoPerfil: string;
    valor: number;
    cor: string;
}