"""djproto URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from data import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path(r'php/save_objects.php', views.save_data),
    path(r'php/get_plants.php', views.get_plants),
    path(r'php/get_objects.php', views.get_objects),

    # path(r'proto/data/users.txt', views.get_objects),
    path(r'proto/data/<str:raw_path>', views.get_objects),

    path(r'', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static('/', document_root=settings.DOCUMENT_ROOT)
    urlpatterns += static('/js', document_root=os.path.join(settings.DOCUMENT_ROOT, 'js'))