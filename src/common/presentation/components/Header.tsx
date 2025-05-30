import { ChevronLeft } from "@mui/icons-material"

export const Header = ({ title, onBackClick }: { title: string, onBackClick?: () => void }) => {
    return (<header className="sticky top-0 bg-white shadow-sm z-20">
        <div className={`max-w-md mx-auto px-4 py-4 flex items-center ${onBackClick ? 'justify-between' : 'justify-center'} gap-2`}>
            {onBackClick && <div className="flex items-center gap-1" onClick={onBackClick} id="backButton">
                <ChevronLeft className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600">Back</span>
            </div>}
            <h1 className="text-xl font-semibold text-gray-900 flex-2">
                {title}
            </h1>
            {onBackClick && <div className="flex items-center gap-1 invisible">
                <ChevronLeft className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600">Back</span>
            </div>}
        </div>
    </header>)
}