import styles from "../styles/Home.module.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { useRef, useState } from "react";
import Head from "next/head";
export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState<{ x: number[]; y: number[] }>();
  const [error, setError] = useState<string | null>();

  let summationX,
    summationY,
    summationXY,
    xy,
    xSquared,
    ySquared,
    summationXSquared,
    summationYSquared,
    AVGx,
    AVGy,
    VARx,
    VARy,
    SDx,
    SDy,
    covariance,
    correlation,
    CVx,
    CVy,
    chartData;

  if (data?.x && data.y) {
    const { x, y } = data;
    xy = x.map((e, i) => e * y[i]);

    const reduceCb = (a: number, b: number) => a + b;

    summationX = x.reduce(reduceCb);
    summationY = y.reduce(reduceCb);
    summationXY = xy.reduce(reduceCb);

    xSquared = x.map((a) => a ** 2);
    ySquared = y.map((a) => a ** 2);

    summationXSquared = xSquared.reduce(reduceCb);
    summationYSquared = ySquared.reduce(reduceCb);

    AVGx = summationX / x.length;
    AVGy = summationY / y.length;

    VARx = summationXSquared / x.length - AVGx ** 2;
    VARy = summationYSquared / y.length - AVGy ** 2;

    SDx = VARx ** 0.5;
    SDy = VARy ** 0.5;

    covariance = summationXY / x.length - AVGx * AVGy;
    correlation = covariance / (SDx * SDy);

    CVx = SDx / AVGx;
    CVy = SDy / AVGy;

    chartData = {
      datasets: [
        {
          label: "Scatter Dataset",
          data: x.map((e, i) => ({ x: e, y: y[i] })),
          backgroundColor: "#5066e8",
        },
      ],
    };
  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const dataXString = formData.get("data-x") as string;
      const dataX = dataXString.split(",").map((a) => Number(a));

      const dataYString = formData.get("data-y") as string;
      const dataY = dataYString.split(",").map((a) => Number(a));

      if (dataX.length === dataY.length) {
        setData({
          x: dataX,
          y: dataY,
        });
        setError(null)
      } else{
        setError('La cantidad de valores en X debe ser igual a la cantidad de valores en Y')
      }
    }
  };

  return (
    <>
      <Head>
        <title>Calculadora de correlación</title>
      </Head>
      <main className={styles.main}>
        <h1>Calculadora de correlación</h1>
        <section>
          <h2>Datos</h2>
          <div className={styles.data}>
            <form ref={formRef} onSubmit={handleSubmit}>
              <label>
                <span>Valores x</span>
                <input className={styles.input} type="text" name="data-x" />
              </label>
              <label>
                <span>Valores y</span>
                <input className={styles.input} type="text" name="data-y" />
              </label>
              <p className={styles.error}>{error}</p>
              <button className={styles.button}>Calcular</button>
            </form>
          </div>
        </section>

        {data?.x && data.y && !error && (
          <>
            <section>
              <h2>Tabla</h2>
              <table className={styles.table}>
                <tbody className={styles.tbody}>
                  {/* X */}
                  <tr className={styles.row1}>
                    <th className={styles.row}>X</th>
                    {data.x.map((number, i) => (
                      <th key={number + `${i}`}>{number}</th>
                    ))}
                  </tr>
                  {/* Y */}
                  <tr>
                    <th className={styles.row}>Y</th>
                    {data.y.map((number, i) => (
                      <th key={number + `${i}`}>{number}</th>
                    ))}
                  </tr>
                  {/* X ** 2 */}
                  <tr>
                    <th className={styles.row}>X²</th>
                    {xSquared?.map((number, i) => (
                      <th key={number + `${i}`}>{number}</th>
                    ))}
                  </tr>
                  {/* Y ** 2 */}
                  <tr>
                    <th className={styles.row}>Y²</th>
                    {ySquared?.map((number, i) => (
                      <th key={number + `${i}`}>{number}</th>
                    ))}
                  </tr>
                  {/* XY */}
                  <tr>
                    <th className={styles.row}>XY</th>
                    {xy?.map((number, i) => (
                      <th key={number + `${i}`}>{number}</th>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>
            <section>
              <h2>Resultados</h2>
              <div className={styles.info}>
                <div className={styles.value}>
                  <span className={styles.name}>Promedio x</span>
                  <span className={styles.result}>{AVGx}</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.name}>Promedio y</span>
                  <span className={styles.result}>{AVGy}</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.name}>CVx</span>
                  <span className={styles.result}>{CVx?.toFixed(5)}</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.name}>CVy</span>
                  <span className={styles.result}>{CVy?.toFixed(5)}</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.name}>Covarianza</span>
                  <span className={styles.result}>
                    {covariance?.toFixed(5)}
                  </span>
                </div>
                <div className={styles.value}>
                  <span className={styles.name}>Correlación</span>
                  <span className={styles.result}>
                    {correlation?.toFixed(5)}
                  </span>
                </div>
              </div>
            </section>
            <section>
              <h2>Grafico</h2>
              <div className={styles.chart}>
                <Scatter
                  data={chartData as any}
                  options={{ responsive: true }}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
