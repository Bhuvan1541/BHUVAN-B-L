
import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, CheckCircle, User, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

export const AppointmentsPanel = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedType, setSelectedType] = useState<'Video Call' | 'In-Person'>('Video Call');
    const [isBooked, setIsBooked] = useState(false);

    const availableSlots = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"];

    const upcomingAppointments: Appointment[] = [
        { id: '1', doctorName: 'Dr. Devaa', date: '2024-03-15', time: '10:00 AM', type: 'Video Call', status: 'Upcoming' }
    ];

    const handleBook = () => {
        setIsBooked(true);
        setTimeout(() => setIsBooked(false), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900">Consultations & Appointments</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Book New Appointment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Type</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSelectedType('Video Call')}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${selectedType === 'Video Call' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <Video className="w-4 h-4" /> Video
                                    </button>
                                    <button 
                                        onClick={() => setSelectedType('In-Person')}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${selectedType === 'In-Person' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <MapPin className="w-4 h-4" /> Clinic
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Available Slots</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {availableSlots.map(slot => (
                                    <button 
                                        key={slot}
                                        className="py-2 px-4 rounded-lg border border-slate-200 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleBook}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {isBooked ? 'Request Sent!' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>

                {/* Side Panel: Upcoming */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={100} /></div>
                        <h3 className="text-lg font-semibold mb-4 relative z-10">Upcoming Sessions</h3>
                        <div className="space-y-4 relative z-10">
                            {upcomingAppointments.map(apt => (
                                <div key={apt.id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded uppercase tracking-wide">
                                            {apt.type}
                                        </span>
                                        <span className="text-xs text-slate-300">{apt.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{apt.doctorName}</p>
                                            <p className="text-xs text-slate-400">Endocrinologist</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-300 pt-2 border-t border-white/10">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                                    </div>
                                    <button className="w-full mt-3 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">
                                        Join Meeting
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-2">Need Help?</h3>
                        <p className="text-sm text-slate-500 mb-4">Contact our support team for urgent rescheduling.</p>
                        <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Contact Support <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
