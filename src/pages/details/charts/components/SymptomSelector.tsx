import { Filter } from "lucide-react";
import { SymptomType } from "../../../../data/enums";

interface SymptomSelectorProps {
    allSymptoms: SymptomType[];
    selectedSymptoms: Set<SymptomType>;
    onSelectSymptoms: (symptoms: Set<SymptomType>) => void;
}

export default function SymptomSelector({ allSymptoms, selectedSymptoms, onSelectSymptoms }: SymptomSelectorProps) {
    const onClick =
        (symptom: SymptomType) => {
            const newSelected = new Set(selectedSymptoms);
            newSelected.has(symptom) ? newSelected.delete(symptom) : newSelected.add(symptom);
            onSelectSymptoms(newSelected);
        }

    return (
        <div >
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Filter Symptoms</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {allSymptoms.map(symptom => (
                    <button
                        key={symptom}
                        onClick={() => onClick(symptom)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedSymptoms.has(symptom) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}
                    >{symptom}</button>
                ))}
            </div>
        </div>
    );
}