'use client';

import { PieChart } from '@mui/x-charts';

import styles from './InfoCard.module.scss';

import { jost, mont } from '@/font';

interface InfoCardProps {
  label?: string;
  amount?: string;
  type: string;
  className?: string;
  isChart?: boolean;
}

const data = [
  { name: 'Group A', value: 15 },
  { name: 'Group B', value: 35 },
];

export default function InfoCard({
  label,
  amount,
  type,
  className,
  isChart,
}: InfoCardProps) {
  return (
    <div className={`${styles.root} ${jost.className} ${className}`}>
      <p className={styles.type}>{type}</p>
      {isChart ? (
        <div className={styles.chart_div}>
          <p className={styles.count}>
            <span>42</span>
            <br />
            Загальна кількість
          </p>
          <PieChart
            className={styles.chart}
            width={1}
            height={200}
            colors={['#fff', '#7AB2B2']}
            series={[
              {
                data: data,
                innerRadius: 65,
                outerRadius: 80,
                paddingAngle: 0,
                cornerRadius: 0,
                startAngle: 0,
                endAngle: 360,
                cx: 0,
                cy: 90,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
          />
          <div className={styles.labels_block}>
            <div className={styles.labels_div}>
              <div className={styles.color_mark} style={{ backgroundColor: '#7AB2B2' }} />
              <p>Успішні угоди</p>
            </div>
            <div className={styles.labels_div}>
              <div className={styles.color_mark} /> <p>Програні угоди</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className={mont.className}>{amount}</h1>
          <p className={styles.label}>{label}</p>
        </div>
      )}
    </div>
  );
}
