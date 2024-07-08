import "./App.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Hearts } from "react-loader-spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//This is passed into ChartJS
export const options = {
  //responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 16,
  },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly average dowry amount in RM",
    },
  },
};

function App() {
  //STATE FOR DISPLAYING FORM
  const [isSubmit, setIsSubmit] = useState(false);

  //STATE FOR DISPLAYING LOADER SPINNER
  const [isLoading, setIsLoading] = useState(false);

  //STATE FOR CHART DATA
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Dataset 1",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointRadius: 4,
      },
    ],
  });

  //REF VARIABLES FOR FORM INPUT
  const monthYear = useRef(null);
  const amountDowry = useRef(null);
  const state = useRef(null);
  const race_h = useRef(null);
  const race_w = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    axios
      .post("http://localhost:3001/dowry", {
        date: monthYear.current.value + "-01",
        amount: amountDowry.current.value,
        state: state.current.value,
        race_husband: race_h.current.value,
        race_wife: race_w.current.value,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmit(true);
    }, 3000);
  }

  useEffect(() => {
    //will run when page is loaded.
    //if pass in anything in the second variable, will run when the var is updated
    //if there is no [] array specified, it will run everytime something changes

    axios.get("http://localhost:3001/dowry/getAverage").then((response) => {
      const data = response.data;

      const month_year_labels = data.map((item) => item.month_year);
      const data_points = data.map((item) => item.avg);

      setChartData({
        labels: month_year_labels,
        datasets: [
          {
            label: "Dataset 1",
            data: data_points,
            borderColor: "rgb(16, 44, 87)",
            backgroundColor: "rgba(16, 44, 87, 0.5)",
            pointRadius: 4,
          },
        ],
      });
    });
  }, []);

  return (
    <div className="App lg:mx-64 md:mx-12 mx-6 my-8 font-sans">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="font-black text-4xl">
            This website shows you how the dowry market rate in Malaysia 🇲🇾
            evolves over time
          </h1>
          <p>
            For some it is a tradition, for others it is a religious obligation.
            The amount given is determined through several factors such as
            comparison, expectations from ‘market rate’. Out of curiosity on how
            the ‘market rate’ changes over time, I started this website to
            crowdsource the amount that people paid during their marriage. While
            there are many nuances, such as the different rates for different
            races. I am starting off with a average value to display on the
            chart and make further improvements as we go.{" "}
          </p>
        </div>
        <div className="bg-[#F3EEE6] p-2 rounded-xl" style={{ width: "99%" }}>
          <Line options={options} data={chartData} width={800} height={500} />
        </div>
        <div className="bg-white drop-shadow-2xl rounded-xl border-2 border-black py-8 px-12">
          <h2 className="font-extrabold text-2xl">Submit yours!</h2>
          {isSubmit ? (
            <div>Thank you!</div>
          ) : (
            <form
              className="flex flex-col space-y-6 items-center "
              onSubmit={handleSubmit}
            >
              <div>
                <label for="date">Date: </label>
                <input
                  ref={monthYear}
                  type="month"
                  className="h-10 rounded-md border-2 w-36"
                  name="date"
                  required
                />
                <br></br>
              </div>
              <div>
                <label for="amount">Amount(RM): </label>
                <input
                  ref={amountDowry}
                  type="number"
                  className="h-10 rounded-md border-2 w-28"
                  name="amount"
                  required
                />
                <br></br>
              </div>
              <div>
                <label for="state">State: </label>
                <select
                  ref={state}
                  className="h-10 rounded-md border-2"
                  name="state"
                >
                  <option disabled selected value="">
                    Select
                  </option>
                  <option value="Johor">Johor</option>
                  <option value="Kedah">Kedah</option>
                  <option value="Kelantan">Kelantan</option>
                  <option value="Melaka">Melaka</option>
                  <option value="Negeri Sembilan">Negeri Sembilan</option>
                  <option value="Pahang">Pahang</option>
                  <option value="Perak">Perak</option>
                  <option value="Perlis">Perlis</option>
                  <option value="Pulau Pinang">Pulau Pinang</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Sarawak">Sarawak</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Terengganu">Terengganu</option>
                </select>
                <br></br>
              </div>
              {/* <input type="text" className='rounded-md border-2' name="state" /><br></br> */}
              <div>
                <label for="race">🤵‍♂️ Husband's race: </label>
                <select
                  ref={race_h}
                  className="h-10 rounded-md border-2"
                  name="race_h"
                >
                  <option disabled selected value="">
                    Select
                  </option>
                  <option value="Malay">Malay</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Native">Native</option>
                  <option value="Mixed">Mixed</option>
                </select>
                <br></br>
              </div>
              <div>
                <label for="race">👰‍♀️ Wife's race: </label>
                <select
                  ref={race_w}
                  className="h-10 rounded-md border-2"
                  name="race_w"
                >
                  <option disabled selected value="">
                    Select
                  </option>
                  <option value="Malay">Malay</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Native">Native</option>
                  <option value="Mixed">Mixed</option>
                </select>
                <br></br>
              </div>
              <div>
                {isLoading ? (
                  <Hearts
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="hearts-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  <button
                    className="rounded-md border-2 border-black py-2 px-16 bg-[#102C57] text-white hover:border-gray-500"
                    type="submit"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
        <div>
          <h3 className="font-bold text-l">
            Built by{" "}
            <a
              className="text-sky-600"
              href="mailto:testskyhunterninja@gmail.com"
            >
              TW{" "}
            </a>{" "}
            🥷
          </h3>
        </div>
      </div>
    </div>
  );
}

export default App;
