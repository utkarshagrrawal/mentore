import React, { useEffect, useState } from "react";
import {
  DismissToast,
  ErrorNotify,
  Loading,
  SuccessNotify,
} from "../global/toast";

export default function BookingsTable({
  loggedIn,
  dataLoading,
  setDataLoading,
  id,
}) {
  const dateFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const getAllMeetings = async () => {
      setDataLoading(true);

      const allMeetings = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/bookings/mentor/" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const response = await allMeetings.json();

      if (response.error && response.error !== "Invalid JWT Token") {
        ErrorNotify(response.error);
      } else {
        setMeetings(response.result);
      }
      setDataLoading(false);
    };

    if (dataLoading) {
      getAllMeetings();
    }
  }, [dataLoading]);

  const getMeetingStatus = (status) => {
    if (status === "pending") {
      return "Pending";
    } else if (status === "approved") {
      return "Approved";
    } else if (status === "payment pending") {
      return "Payment pending";
    } else {
      return "Rejected";
    }
  };

  const handlePay = async (id) => {
    const toastId = Loading("Processing payment...");

    const pay = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/payment/pay/" + id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: "Payment_for_mentor_session_for_" + id,
        }),
      }
    );
    const response = await pay.json();

    DismissToast(toastId);

    if (response.error) {
      ErrorNotify(response.error);
    } else {
      const options = {
        key: response.key_id,
        amount: response.fees * 100,
        currency: "INR",
        name: "Mentore",
        description: "Payment for mentor session",
        image:
          "https://images.pexels.com/photos/6325962/pexels-photo-6325962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        order_id: response.result.id,
        handler: async function (response) {
          const paymentsuccess = async () => {
            const payment = await fetch(
              import.meta.env.VITE_BACKEND_URL + "/payment/success/" + id,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );
            const response = await payment.json();

            if (response.error) {
              ErrorNotify(response.error);
            } else {
              SuccessNotify(response.result);
              location.reload();
            }
          };
          await paymentsuccess();
        },
        notes: {
          address: "Mentore corporate office",
        },
        theme: {
          color: "#2463eb",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        return ErrorNotify("Payment failed");
      });
      rzp.open();
    }
  };

  const handleJoinMeeting = async (link) => {
    const join = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/meeting/join/participant",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_id: link,
        }),
        credentials: "include",
      }
    );
    const response = await join.json();
    if (response.error) {
      return ErrorNotify(response.error);
    } else {
      return window.open(response.success, "_blank");
    }
  };

  return (
    <div className="container mx-auto my-10">
      <div className="bg-blue-50 rounded-lg shadow-lg p-6">
        <h1 className="text-center text-3xl font-bold text-black">
          Current bookings
        </h1>
        <div className="relative overflow-x-auto mt-4 border-[0.1rem] border-black sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
            <thead className="text-xs text-white uppercase bg-blue-700">
              <tr className="text-center uppercase">
                <th scope="col" className="px-6 py-3">
                  Start time
                </th>
                <th scope="col" className="px-6 py-3">
                  End time
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 my-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {meetings && meetings?.length > 0 ? (
                meetings.map((item) => {
                  if (
                    new Date(item.end_time).toISOString() >
                    new Date().toISOString()
                  ) {
                    return (
                      <tr key={item.uniq_id} className="text-center text-black">
                        <td scope="row" className="px-6 py-3">
                          {dateFormatter.format(new Date(item.start_time))}
                        </td>
                        <td scope="row" className="px-6 py-3">
                          {dateFormatter.format(new Date(item.end_time))}
                        </td>
                        <td scope="row" className="px-6 py-3">
                          {getMeetingStatus(item.status)}
                        </td>
                        <td scope="row" className="px-6 py-3">
                          {item.status === "pending" && (
                            <button
                              disabled={true}
                              className="border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm py-1 w-full"
                            >
                              Pending
                            </button>
                          )}
                          {item.status === "payment pending" && (
                            <button
                              onClick={() => handlePay(item.uniq_id)}
                              className="border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm py-1 w-full"
                            >
                              Pay
                            </button>
                          )}
                          {item.status === "approved" && (
                            <button
                              disabled={
                                new Date() > new Date(item.end_time) ||
                                (new Date() < new Date(item.start_time)
                                  ? "true"
                                  : "false")
                              }
                              onClick={() =>
                                handleJoinMeeting(item.meeting_link)
                              }
                              className="border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm py-1 w-full"
                            >
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr className="text-center text-black">
                  <td scope="row" className="px-6 py-3" colSpan="4">
                    {loggedIn
                      ? "No bookings found"
                      : "Please login to view your bookings"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
