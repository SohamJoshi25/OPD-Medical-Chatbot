
import { useEffect, useState,useRef } from 'react';
import { useResponseContext } from '../../contexts/responseContext'
//import { PatientData } from '../../types/PatientData';
import {generatePDF} from "../../utils/PdfGen";
import { useNavigate } from 'react-router-dom';


const Response = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [time, setTime] = useState<number>(60);
    const { response } = useResponseContext();
    const hasGeneratedPDF = useRef(false); // prevent double run

    useEffect(() => {
        if (!hasGeneratedPDF.current) {
            hasGeneratedPDF.current = true;

            if (response) {
                generatePDF(JSON.parse(response));
                setLoading(false);
            } else {
                navigate("/");
            }
        }
    }, [response, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (time === 0) {
            navigate("/");
        }
    }, [time, navigate]);

    return !loading ? (
        <div className='flex justify-center flex-col items-center h-screen gap-5 text-center'>
            <span className='text-3xl font-semibold'>Thank You for visiting this hospital.</span>
            <span className='text-2xl w-[700px]'>
                Your Appointment has been Booked with Appointment ID <span className='font-semibold'>{JSON.parse(response).id}</span> and Recommend OPD is <span className='font-semibold'>{JSON.parse(response).RecommendedOPD}</span>
            </span>
            <span className='text-lg w-[700px] mt-20'>You will be navigated back to home page in {time}</span>
        </div>
    ) : (
        <div className='flex justify-center flex-col items-center h-screen gap-5 text-center'>Loading . . .</div>
    );
};

export default Response;
