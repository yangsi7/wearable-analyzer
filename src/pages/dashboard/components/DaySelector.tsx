import { CalendarMonth } from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from '../../../utils/date_utils';

interface DaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  maximumDate: Date;
  minimumDate: Date;
}

// TODO: check timezone issues
export function DaySelector({
  selectedDate,
  onDateChange,
  maximumDate,
  minimumDate,
}: DaySelectorProps) {
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setShowFullCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const firstDayOfMonth = days[0].getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);


  return (
    <div className="glass-card flex items-center justify-between py-4 px-4 mb-6 relative z-10" ref={triggerRef}>
      <button
        onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(selectedDate.getDate() - 1);
          onDateChange(newDate);
        }}
        disabled={selectedDate <= minimumDate}
        className="glass-button p-2"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5 text-blue-600" />
      </button>
      <div className='flex items-center space-x-2' onClick={() => setShowFullCalendar(!showFullCalendar)}>
        <CalendarMonth className="w-6 h-6" />
        <span className="text-center text-xl font-semibold text-gray-900">
          {formatDate(selectedDate)}
        </span>
      </div>
      <button
        onClick={() => {
          const newDate = new Date(selectedDate);
          newDate.setDate(selectedDate.getDate() + 1);
          onDateChange(newDate);
        }}
        disabled={selectedDate >= maximumDate}
        className="glass-button p-2"
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5 text-blue-600" />
      </button>

      {/* Calendar overlay */}
      {showFullCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-full mt-2 bg-white border rounded-lg shadow-lg p-4 inset-x-8 z-50"
        >
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">
              {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="h-8" />
            ))}
            {days.map((date) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isToday = new Date().toDateString() === date.toDateString();
              const isDisabled = date < minimumDate || date > maximumDate;
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => {
                    onDateChange(date);
                    setShowFullCalendar(false);
                  }}
                  disabled={isDisabled}
                  className={`
                    h-8 rounded-full flex items-center justify-center text-sm
                    hover:bg-gray-100
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${isToday && !isSelected ? 'border border-blue-500' : ''}
                    ${isDisabled ? 'text-gray-300' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

