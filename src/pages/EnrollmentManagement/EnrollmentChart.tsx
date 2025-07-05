import React, { useEffect, useState } from "react";
import Chart from "@/components/Base/Chart";
import { colors } from "@/utils/colors";

interface EnrollmentChartProps {
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
}

const EnrollmentChart: React.FC<EnrollmentChartProps> = ({
  pending,
  approved,
  completed,
  rejected
}) => {
  const [chartData, setChartData] = useState({
    donutOptions: {},
    barOptions: {}
  });

  useEffect(() => {
    // Set up chart options
    setChartData({
      donutOptions: {
        series: [pending, approved, completed, rejected],
        chart: {
          width: 380,
          type: "donut",
          toolbar: {
            show: false,
          },
        },
        labels: ["Pending", "Approved", "Completed", "Rejected"],
        colors: [colors.warning, colors.success, colors.primary, colors.danger],
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontFamily: "Inter",
                },
                value: {
                  show: true,
                  fontFamily: "Inter",
                  formatter: function (val: number) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  fontFamily: "Inter",
                  label: "Total",
                  formatter: function () {
                    return pending + approved + completed + rejected;
                  },
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "bottom",
          fontFamily: "Inter",
        },
        tooltip: {
          shared: false,
          intersect: true,
        },
      },
      barOptions: {
        series: [
          {
            name: "Enrollments",
            data: [pending, approved, completed, rejected],
          },
        ],
        chart: {
          type: "bar",
          height: 300,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: ["Pending", "Approved", "Completed", "Rejected"],
        },
        yaxis: {
          title: {
            text: "Enrollments",
            style: {
              fontFamily: "Inter",
            },
          },
        },
        fill: {
          opacity: 1,
          colors: [colors.warning, colors.success, colors.primary, colors.danger],
        },
        tooltip: {
          y: {
            formatter: function (val: number) {
              return val + " enrollments";
            },
          },
        },
        colors: [colors.warning, colors.success, colors.primary, colors.danger],
      },
    });
  }, [pending, approved, completed, rejected]);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-6">
        <div className="flex flex-col pb-5 mb-5">
          <h2 className="text-base font-medium">Enrollment Status Distribution</h2>
          <div className="text-slate-500 text-sm">Breakdown of enrollment statuses</div>
        </div>
        <Chart
          type="donut"
          height={300}
          options={chartData.donutOptions}
          series={chartData.donutOptions.series}
          className="mt-5"
        />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="flex flex-col pb-5 mb-5">
          <h2 className="text-base font-medium">Enrollment Status Comparison</h2>
          <div className="text-slate-500 text-sm">Count by enrollment status</div>
        </div>
        <Chart
          type="bar"
          height={300}
          options={chartData.barOptions}
          series={chartData.barOptions.series}
          className="mt-5"
        />
      </div>
    </div>
  );
};

export default EnrollmentChart;
