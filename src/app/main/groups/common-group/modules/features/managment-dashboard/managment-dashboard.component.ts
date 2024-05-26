import {Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import {ManagmentDashboardService} from '../../service/managment-dashboard.service';
import { Chart, registerables } from 'chart.js';
import {ValidationMessage} from '../../../../../core/constants/validation.message';
import {saveAs as importedSaveAs} from 'file-saver';
Chart.register(...registerables);

/**
 * @Project   bof-erp-ui
 * @Author    Md. Mizanur Rahman - 598
 * @Mail      mizanur.rahman@ibcs-primax.com
 * @Since     April 13, 2022
 * @version   1.0.0
 */
@Component({
    selector       : 'managment-dashboard',
    templateUrl    : './managment-dashboard.component.html'
})
export class ManagmentDashboardComponent implements OnInit, OnDestroy {
    chartGithubIssues: ApexOptions = {};
    chartGithubIssues2: ApexOptions = {};
    chartGender: ApexOptions;
    visitorChartConfig: any;
    visitorChartConfigLastWeek: any;
    erpChartConfig: any;
    erpChartLastWeekConfig: any;
    erpChartLoginConfig: any;
    erpChartLoginLastWeekConfig: any;
    erpChartReportGenerationConfig: any;
    erpChartReportGenerationLastWeekConfig: any;
    data: any;
    validationMsg: ValidationMessage = new ValidationMessage();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private modelService: ManagmentDashboardService,
        private router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.modelService.getDashboardData().subscribe(res => {
            const tempDate = res;
            this.data = tempDate;
            console.log(this.data);
            this.implementAnimation();

            // Prepare the chart data
            this._prepareChartData();

            // Attach SVG fill fixer to all ApexCharts
            window['Apex'] = {
                chart: {
                    events: {
                        mounted: (chart: any, options?: any) => {
                            this._fixSvgFill(chart.el);
                        },
                        updated: (chart: any, options?: any) => {
                            this._fixSvgFill(chart.el);
                        }
                    }
                }
            };


            // @ts-ignore
            const visitorChart = new Chart(document.getElementById('visitorChart'), this.visitorChartConfig);
            // @ts-ignore
            const visitorChartLastWeek = new Chart(document.getElementById('visitorChartLastWeek'), this.visitorChartConfigLastWeek);
            // @ts-ignore
            const erpChart = new Chart(document.getElementById('erpChart'), this.erpChartConfig);
            // @ts-ignore
            const erpChartLastWeek = new Chart(document.getElementById('erpChartLastWeek'), this.erpChartLastWeekConfig);
            // @ts-ignore
            const erpChartLogin = new Chart(document.getElementById('erpChartLogin'), this.erpChartLoginConfig);
            // @ts-ignore
            const erpChartLoginLastWeek = new Chart(document.getElementById('erpChartLoginLastWeek'), this.erpChartLoginLastWeekConfig);
            // @ts-ignore
            const erpChartReportGeneration = new Chart(document.getElementById('erpChartReportGeneration'), this.erpChartReportGenerationConfig);
            // @ts-ignore
            const erpChartReportGenerationLastWeek = new Chart(document.getElementById('erpChartReportGenerationLastWeek'), this.erpChartReportGenerationLastWeekConfig);
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    animateValue(obj, start, end, duration): any {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) { startTimestamp = timestamp; }
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    implementAnimation(): void{
        const itemZeroObj = document.getElementById('itemZero');
        this.animateValue(itemZeroObj, 0, this.data.item.zero, 1000);

        const itemDangerObj = document.getElementById('itemDanger');
        this.animateValue(itemDangerObj, 0, this.data.item.danger, 1000);

        const itemWarningObj = document.getElementById('itemWarning');
        this.animateValue(itemWarningObj, 0, this.data.item.warning, 1000);

        const itemAvailableObj = document.getElementById('itemAvailable');
        this.animateValue(itemAvailableObj, 0, this.data.item.available, 1000);

        const prodCuttingObj = document.getElementById('prodCutting');
        this.animateValue(prodCuttingObj, 0, this.data.githubIssues.overview.thisweek.fixed, 1000);

        const prodSkivingObj = document.getElementById('prodSkiving');
        this.animateValue(prodSkivingObj, 0, this.data.githubIssues.overview.thisweek.wontfix, 1000);

        const prodSewingObj = document.getElementById('prodSewing');
        this.animateValue(prodSewingObj, 0, this.data.githubIssues.overview.thisweek.reopened, 1000);

        const prodLastingObj = document.getElementById('prodLasting');
        this.animateValue(prodLastingObj, 0, this.data.githubIssues.overview.thisweek.needstriage, 1000);

        const prodRunningOrderObj = document.getElementById('prodRunningOrder');
        this.animateValue(prodRunningOrderObj, 0, this.data.githubIssues.overview.thisweek.newissues, 1000);

        const prodClosedOrderObj = document.getElementById('prodClosedOrder');
        this.animateValue(prodClosedOrderObj, 0, this.data.githubIssues.overview.thisweek.closedissues, 1000);
    }

    changeIssueLastWeek(): void{
        const prodCuttingObj = document.getElementById('prodCutting');
        this.animateValue(prodCuttingObj, 0, this.data.githubIssues.overview.lastweek.fixed, 1000);

        const prodSkivingObj = document.getElementById('prodSkiving');
        this.animateValue(prodSkivingObj, 0, this.data.githubIssues.overview.lastweek.wontfix, 1000);

        const prodSewingObj = document.getElementById('prodSewing');
        this.animateValue(prodSewingObj, 0, this.data.githubIssues.overview.lastweek.reopened, 1000);

        const prodLastingObj = document.getElementById('prodLasting');
        this.animateValue(prodLastingObj, 0, this.data.githubIssues.overview.lastweek.needstriage, 1000);
    }


    changeIssueThisWeek(): void{
        const prodCuttingObj = document.getElementById('prodCutting');
        this.animateValue(prodCuttingObj, 0, this.data.githubIssues.overview.thisweek.fixed, 1000);

        const prodSkivingObj = document.getElementById('prodSkiving');
        this.animateValue(prodSkivingObj, 0, this.data.githubIssues.overview.thisweek.wontfix, 1000);

        const prodSewingObj = document.getElementById('prodSewing');
        this.animateValue(prodSewingObj, 0, this.data.githubIssues.overview.thisweek.reopened, 1000);

        const prodLastingObj = document.getElementById('prodLasting');
        this.animateValue(prodLastingObj, 0, this.data.githubIssues.overview.thisweek.needstriage, 1000);
    }

    private _fixSvgFill(element: Element): void {
        const currentURL = this.router.url;

        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    private _prepareChartData(): void {
        // Production
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'bar',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors : ['#ff5a27'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // income vs expense
        this.chartGithubIssues2 = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#6366f1', '#d87041', '#d11e1e', '#ff0600', '#ff0600', '#ff0600', '#ff0600'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.githubIssues2.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.data.githubIssues2.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // order
        this.chartGender = {
            chart      : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'donut',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#319795', '#d1b41f', '#d11e1e'],
            labels     : this.data.gender.labels,
            plotOptions: {
                pie: {
                    customScale  : 0.9,
                    expandOnClick: false,
                    donut        : {
                        size: '70%'
                    }
                }
            },
            series     : this.data.gender.series,
            states     : {
                hover : {
                    filter: {
                        type: 'none'
                    }
                },
                active: {
                    filter: {
                        type: 'none'
                    }
                }
            },
            tooltip    : {
                enabled        : true,
                fillSeriesColor: false,
                theme          : 'dark',
                custom         : ({
                                      seriesIndex,
                                      w
                                  }) => {
                    return `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                            </div>`;
                }
            }
        };

        this.visitorChartConfig = {
            type: 'bar',
            data: this.data.visitor,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.visitorChartConfigLastWeek = {
            type: 'bar',
            data: this.data.visitorLastWeek,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartConfig = {
            type: 'bar',
            data: this.data.erp,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartLastWeekConfig = {
            type: 'bar',
            data: this.data.erpLastWeek,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartLoginConfig = {
            type: 'bar',
            data: this.data.erpLogin,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartLoginLastWeekConfig = {
            type: 'bar',
            data: this.data.erpLoginLastWeek,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartReportGenerationConfig = {
            type: 'bar',
            data: this.data.erpReportGenaration,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

        this.erpChartReportGenerationLastWeekConfig = {
            type: 'bar',
            data: this.data.erpReportGenarationLastWeek,
            options: {
                indexAxis: 'y',
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        };

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    printNotice(filename: string): any{
        const ext = filename.substring(filename.lastIndexOf('.') + 1);
        if (ext.toLowerCase() === 'pdf'){
            this.modelService.printFile(filename).subscribe(blob => window.open(window.URL.createObjectURL(blob)));
        }else{
            this.modelService.downloadFile(filename).subscribe(blob =>
                importedSaveAs(blob, filename)
            );
        }
    }

    onClickLifeTimeActivities(): void{
        const filename = 'management-dashboard-life-time-activities.pdf';
        this.modelService.printLifeTimeActivities(filename).subscribe(blob => window.open(window.URL.createObjectURL(blob)));
    }
}
