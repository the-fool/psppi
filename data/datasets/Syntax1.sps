* Encoding: UTF-8.

DATASET ACTIVATE DataSet1.
FREQUENCIES VARIABLES=gender birth_yr education party_aff ideology born_again rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis term_lim fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_services tax_inc_temp tax_inc_mil tax_inc_grad
tax_gas tax_ret_inc abort_leg lg_rights
  /ORDER=ANALYSIS.

#2009.
dataset activate DataSet5.
FREQUENCIES VARIABLES=gender birth_yr Generation education party_aff born_again rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_services tax_inc_temp abort_leg lg_rights
  /ORDER=ANALYSIS.

recode area (4=3).
recode party_aff (4=8).
frequencies variables=party_aff.
FREQUENCIES variables=area.
FREQUENCIES VARIABLES=Generation.
FREQUENCIES VARIABLES=birth_yr.

***2010.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology born_again rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis term_lim fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_inc_temp abort_leg lg_rights
  /ORDER=ANALYSIS.

RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
recode birth_yr (1900=0).
DATASET ACTIVATE DataSet8.
FREQUENCIES VARIABLES=Generation birth_yr.

RECODE born_again (SYSMIS=3) (2 thru 4=2).
FREQUENCIES VARIABLES=born_again religion.
EXECUTE.

RECODE ideology (3=2) (6=9) (1 thru 2=1) (4 thru 5=3).
FREQUENCIES VARIABLES=ideology.
EXECUTE.

RECODE party_aff (4=2) (8=9) (1 thru 3=1) (5 thru 7=3).
FREQUENCIES VARIABLES=party_aff.
EXECUTE.

**2011.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology born_again rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis term_lim fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks cuts_poor gamble_exp tax_services tax_ret_inc
  /ORDER=ANALYSIS.UTE.

**2012.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis term_lim abort_leg lg_rights
  /ORDER=ANALYSIS.UTE.

recode lg_rights (9=4).
FREQUENCIES VARIABLES=lg_rights.

**2013.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology rac_eth area hhinc
rwdiril rwdirlocal rwdirusa redist_commis fix_deficit_il gamble_exp tax_services tax_inc_temp abort_leg lg_rights
  /ORDER=ANALYSIS.UTE.

**2014a.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa term_lim fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_services tax_inc_temp tax_ret_inc abort_leg lg_rights  
  /ORDER=ANALYSIS.UTE.

**2014b.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender birth_yr education party_aff ideology born_again rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis fix_deficit_il tax_inc_temp tax_inc_mil abort_leg lg_rights  
  /ORDER=ANALYSIS.UTE.

**2015.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_services tax_inc_temp tax_inc_mil tax_inc_grad
tax_ret_inc abort_leg lg_rights  
  /ORDER=ANALYSIS.UTE.
FREQUENCIES VARIABLES=party_aff ideology.

**2016.
RECODE birth_yr (0=0) (1901 thru 1946=1) (1947 thru 1964=2) (1965 thru 1983=3) (1984 thru 2004=4) INTO 
    Generation.
FREQUENCIES VARIABLES=gender Generation birth_yr education party_aff ideology rac_eth area hhinc
qlife rwdiril rwdirlocal rwdirusa redist_commis term_lim fix_deficit_il pen_cuts cuts_cops cuts_dis
cuts_he cuts_K12 cuts_parks gamble_exp tax_services tax_inc_temp tax_inc_mil tax_inc_grad
tax_gas tax_ret_inc abort_leg lg_rights  
  /ORDER=ANALYSIS.UTE.






























