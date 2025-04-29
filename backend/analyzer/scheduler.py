from apscheduler.schedulers.background import BackgroundScheduler
from analyzer.tasks import check_projects_for_new_cves

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_projects_for_new_cves, 'interval', days=1, id='check_projects')
    scheduler.start()