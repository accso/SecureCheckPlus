from django.apps import AppConfig
import os

class AnalyzerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'analyzer'

    def ready(self):
        if os.environ.get('RUN_MAIN', None) != 'true':
            from analyzer.scheduler import start_scheduler
            start_scheduler()
