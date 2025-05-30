import { FavoriteBorder } from "@mui/icons-material"

export const BulletPoint = ({ title, description }: { title: string, description?: string }) => {
    return (<div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full leading-none">
            <FavoriteBorder fontSize='small' className="text-blue-600" />
        </div>
        <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600">
                {description}
            </p>}
        </div>
    </div>)
}