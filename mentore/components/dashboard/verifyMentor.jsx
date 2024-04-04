import React, { useEffect, useState } from "react";
import { ErrorNotify, SuccessNotify } from "../global/toast";

export default function VerifyMentor() {
    const [pendingVerifications, setPendingVerifications] = useState([])
    const [updatePendingVerifications, setUpdatePendingVerifications] = useState(true)

    useEffect(() => {
        const fetchPendingVerifications = async () => {
            const response = await fetch('https://mentore-ten.vercel.app/admin/pending-verifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const result = await response.json();

            if (result.error) {
                ErrorNotify(result.error)
            } else {
                setPendingVerifications(result.result)
            }
            setUpdatePendingVerifications(false)
        }

        if (updatePendingVerifications) {
            fetchPendingVerifications()
        }

    }, [updatePendingVerifications])

    const handleApprove = async (id) => {
        const approveRequest = await fetch('https://mentore-ten.vercel.app/admin/verify-mentor?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
        })
        const response = await approveRequest.json();

        if (response.error) {
            ErrorNotify(response.error)
        } else {
            SuccessNotify("Mentor verified successfully!")
        }
        setUpdatePendingVerifications(true);
    }

    const handleReject = async (id) => {
        const rejectRequest = await fetch('https://mentore-ten.vercel.app/admin/reject-mentor?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
        })
        const response = await rejectRequest.json();

        if (response.error) {
            ErrorNotify(response.error)
        }
        else {
            SuccessNotify("Mentor rejected successfully!")
        }
        setUpdatePendingVerifications(true);
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Pending verifications</h1>
            <div className='w-full mb-8'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr className='text-center'>
                                <th scope="col" className="px-6 py-3">
                                    Mentor name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mentor email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mentor skills
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingVerifications.length > 0 ? pendingVerifications.map((item) => {
                                return (
                                    <tr key={item.uniq_id} className="text-center">
                                        <th scope="row" className="px-6 py-4 font-medium text-black whitespace-pre-line">
                                            {item.mentor_name}
                                        </th>
                                        <td className="px-6 py-4 text-black">
                                            {item.mentor_email}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.skills}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.status === 'pending' && (
                                                <div className='grid grid-cols-2 gap-2'>
                                                    <button onClick={() => handleApprove(item.uniq_id)} className='border border-green-500 duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-500 hover:text-white font-medium rounded-lg text-sm py-1'>
                                                        Accept
                                                    </button>
                                                    <button onClick={() => handleReject(item.uniq_id)} className='border border-red-500 duration-150 hover:bg-red-700 focus:ring-2 focus:ring-red-500 hover:text-white font-medium rounded-lg text-sm py-1'>
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr className="text-center">
                                    <td className="px-6 py-4 text-black" colSpan='4'>
                                        No pending verifications
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}