import React, { useState, useMemo } from 'react';
import { FileText, Search, Upload, Download, Edit, Trash2 } from 'lucide-react';
import { templates, generateDocument } from '../utils/documentTemplates';

type DocumentType = 'certificats' | 'tests' | 'autre';

interface Document {
  id: string;
  templateId: string;
  type: DocumentType;
  name: string;
  category: string;
  dateCreation: string;
  lastModified: string;
  content?: string;
}

export default function Treatments() {
  const [activeTab, setActiveTab] = useState<DocumentType>('certificats');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([
    ...templates.certificats.map(template => ({
      id: template.id,
      templateId: template.id,
      type: 'certificats' as DocumentType,
      name: template.name,
      category: template.category,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      lastModified: new Date().toLocaleDateString('fr-FR'),
    })),
    ...templates.tests.map(template => ({
      id: template.id,
      templateId: template.id,
      type: 'tests' as DocumentType,
      name: template.name,
      category: template.category,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      lastModified: new Date().toLocaleDateString('fr-FR'),
    })),
    ...templates.autre.map(template => ({
      id: template.id,
      templateId: template.id,
      type: 'autre' as DocumentType,
      name: template.name,
      category: template.category,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      lastModified: new Date().toLocaleDateString('fr-FR'),
    })),
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: Document = {
        id: `custom_${Date.now()}`,
        templateId: `custom_${Date.now()}`,
        type: activeTab,
        name: file.name.replace('.docx', ''),
        category: 'Personnalisé',
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        lastModified: new Date().toLocaleDateString('fr-FR'),
      };
      setDocuments([...documents, newDocument]);
    }
  };

  const handleDocumentDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleDocumentDownload = async (doc: Document) => {
    try {
      await generateDocument(doc.templateId, doc.type);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Une erreur est survenue lors du téléchargement du document.');
    }
  };

  const handleDocumentEdit = async (doc: Document) => {
    try {
      await generateDocument(doc.templateId, doc.type);
    } catch (error) {
      console.error('Erreur lors de l\'édition:', error);
      alert('Une erreur est survenue lors de l\'ouverture du document.');
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (doc.type !== activeTab) return false;

      const searchTerms = searchTerm.toLowerCase().split(' ');
      
      return searchTerms.every(term => {
        if (term.startsWith('*') && term.endsWith('*')) {
          const searchPattern = term.slice(1, -1).toLowerCase();
          if (searchPattern) {
            const searchableContent = [
              doc.name,
              doc.category,
              doc.dateCreation,
              doc.lastModified,
              doc.type
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchableContent.includes(searchPattern);
          }
          return true;
        }

        const searchableContent = [
          doc.name,
          doc.category,
          doc.dateCreation,
          doc.lastModified,
          doc.type
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableContent.includes(term);
      });
    });
  }, [documents, activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Documents médicaux</h2>
        <label className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
          <Upload className="h-5 w-5 mr-2" />
          Importer un document
          <input
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {(['certificats', 'tests', 'autre'] as DocumentType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === type
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher un document (utilisez * pour une recherche partielle)..."
            />
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>Créé le {doc.dateCreation}</span>
                      <span>•</span>
                      <span>Modifié le {doc.lastModified}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDocumentEdit(doc)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Éditer"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(doc)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Télécharger"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDocumentDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}